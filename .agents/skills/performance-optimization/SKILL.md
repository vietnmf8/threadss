---
name: performance-optimization
description: Detailed guidelines, architecture patterns, anti-patterns (memory leaks, race conditions, CLS), and standards for high-performance React rendering, list virtualization, keep-alive state preservation, scroll restoration, and RTK Query cache deduplication.
---

# Performance Optimization Standards & Best Practices

This document establishes the strict performance guidelines and architecture standards for the **Threads Clone** project to guarantee 60fps scrolling, zero cumulative layout shift (CLS = 0), instant tab transitions, zero memory leaks, and race-condition free data fetching.

---

## 1. Core Architectural Pillars of High Performance

### A. List Virtualization & Layout Preservation
1. **Dynamic Item Virtualization (`VirtualizedItem`):**
   - Wrap long dynamic feeds with `VirtualizedItem` to unmount off-screen DOM nodes.
   - Use `useInView` with a buffer zone (`rootMargin: "1000px 0px"`) to pre-render items 1000px before scrolling into view.
2. **Anti-Flicker & Height Preservation:**
   - Always measure dynamic element heights using `ResizeObserver` via `useMeasureHeight(id)`.
   - Persist measured pixel heights in a module-scoped `heightCache = new Map()` so height measurements survive unmounting/remounting.
   - Apply `minHeight: cachedHeight` on placeholder containers when items are virtualized out of DOM.
3. **Freeze State Optimization:**
   - Freeze virtualization recalculations when the parent container or tab is hidden (`isActiveTab = false`).

```jsx
/* VirtualizedItem Pattern */
const VirtualizedItem = ({ id, children, isActiveTab }) => {
    const [containerRef, inView] = useInView({ rootMargin: "1000px 0px" });
    const [measureRef, cachedHeight] = useMeasureHeight(id);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (!isActiveTab) return; // Freeze State
        const delay = isFirstMount.current ? 100 : 50;
        const timeoutId = setTimeout(() => setShouldRender(inView), delay);
        return () => clearTimeout(timeoutId);
    }, [inView, isActiveTab]);

    const isVirtualized = !shouldRender && cachedHeight > 0;

    return (
        <div ref={containerRef} style={{ minHeight: isVirtualized ? `${cachedHeight}px` : undefined }}>
            {!isVirtualized ? <div ref={measureRef}>{children}</div> : null}
        </div>
    );
};
```

---

### B. Keep-Alive DOM Preserving Tabs & Zero-Flicker Scroll Snapshotting
1. **Keep-Alive Subtrees:**
   - NEVER unmount active tab panels (e.g., `For You`, `Following`, `Ghost`) on route/tab switches.
   - Toggle visibility using CSS `display: none` / `display: block` (`className={isActive ? "block min-h-full" : "hidden"}`).
2. **Synchronous Scroll Restoration:**
   - Snapshot scroll coordinates of the active tab before it is hidden.
   - Restore saved scroll position using `useLayoutEffect` before browser paint.
3. **Passive Scroll Listeners:**
   - ALWAYS attach window scroll event listeners with `{ passive: true }` to eliminate main-thread scroll jank.

```jsx
/* Passive Scroll Listener & Snapshot Pattern */
useEffect(() => {
    const handleScroll = () => { lastKnownScrollRef.current = window.scrollY; };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
}, []);

useLayoutEffect(() => {
    if (prevTabIdRef.current !== activeTabId) {
        scrollPositionsRef.current[prevTabIdRef.current] = lastKnownScrollRef.current;
    }
    const savedPosition = scrollPositionsRef.current[activeTabId] || 0;
    window.scrollTo(0, savedPosition);
    prevTabIdRef.current = activeTabId;
}, [activeTabId]);
```

---

### C. Network, RTK Query Cache & Deduplication
1. **Cache Key Serialization & Merging:**
   - Use `serializeQueryArgs` to group caches by category/type.
   - Always merge paginated results and deduplicate items using `Set` to prevent duplicate React keys and wasted re-renders.
2. **Optimistic UI Updates with Automatic Rollback:**
   - Update RTK Query cache instantly via `onQueryStarted` using `postApi.util.updateQueryData`.
   - Wrap mutation requests in `try-catch` blocks and execute `patchResult.undo()` on network failures.
3. **RefreshToken Queue Interceptor (Anti-Stampede):**
   - Centralize token refreshing in `httpRequest.js`.
   - Use `isRefreshing` lock flag and `failedQueue` array to prevent multiple concurrent 401 requests from triggering parallel refresh token calls.

```javascript
/* Deduplication Merge Pattern */
merge: (currentCache, newResponse, { arg }) => {
    if (arg.page === 1) return newResponse;
    const existingIds = new Set(currentCache.data?.map((p) => p.id) || []);
    const newItems = newResponse.data?.filter((p) => !existingIds.has(p.id)) || [];
    return {
        ...newResponse,
        data: [...(currentCache.data || []), ...newItems],
    };
}
```

---

### D. Input Debouncing & Asset Optimization
1. **Input Debouncing:** Use `useDebounce` with 600-800ms delay on search inputs or availability validation to prevent network spamming.
2. **Vector Assets:** SVGs must be imported as React components using `vite-plugin-svgr` without inline runtime style definitions.

---

## 2. Prohibited Classic Anti-Patterns (Critical Violation Rules)

| Anti-Pattern | Description | Mandatory Fix |
| :--- | :--- | :--- |
| **1. Memory Leaks (Uncleaned Effects)** | Attaching `addEventListener`, `setInterval`, `ResizeObserver`, or `IntersectionObserver` without return cleanup. | ALWAYS return cleanup functions in `useEffect`. Disconnect observers and clear timeouts. |
| **2. Race Conditions (Stale Async Updates)** | Executing async requests (e.g., live search) without cancelling previous calls or debouncing. | Use `useDebounce` (600ms+) or `AbortController` / RTK Query query cancellation. |
| **3. Layout Shift / CLS > 0** | Unmounting virtualized dynamic elements without preserving container pixel height. | Store measured heights in a persistent `Map` cache and apply `minHeight`. |
| **4. Non-Passive Event Listeners** | Attaching touch/scroll events without `{ passive: true }`. | ALWAYS pass `{ passive: true }` to `window.addEventListener("scroll", handler, { passive: true })`. |
| **5. Unstable React Keys** | Using array index `key={index}` or `Math.random()` on reordered or dynamic lists. | ALWAYS use unique entity IDs (e.g., `key={post.id}`). |
| **6. Token Refresh Stampede** | Allowing multiple failing 401 requests to send independent refresh token requests. | Use lock flag `isRefreshing` and promise queue (`failedQueue`) in Axios interceptor. |
| **7. Re-rendering Unmounted Tabs** | Unmounting/remounting complex route tabs or updating hidden tab components. | Keep tab subtrees in DOM (`display: none`) and apply Freeze State checks. |

---

## 3. Performance Review & Checklist

Before merging code changes, verify:
- [ ] Are all `useEffect` observers, timers, and event listeners cleaned up?
- [ ] Are dynamic scroll lists wrapped with `VirtualizedItem` + `heightCache` `minHeight`?
- [ ] Are scroll listeners registered with `{ passive: true }`?
- [ ] Do search inputs use `useDebounce`?
- [ ] Are RTK Query paginated results deduplicated with `Set`?
- [ ] Are optimistic updates wrapped with rollback logic?
