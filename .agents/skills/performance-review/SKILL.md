---
name: performance-review
description: Comprehensive audit methodology, static code review checklist, and automated Node.js scanning script to identify performance bottlenecks, memory leaks, race conditions, layout shifts (CLS), and missing optimizations.
---

# Performance Review & Audit Skill

This skill provides a systematic approach for reviewing, auditing, and enforcing high-performance standards in the codebase without requiring heavy DevTools MCP dependencies.

---

## 1. Automated Performance Audit Script

Run the automated performance scanner script from the root workspace directory to inspect the `src/` directory for common performance anti-patterns:

```bash
node .agents/skills/performance-review/scripts/audit-performance.js
```

### What the Automated Scanner Checks:
1. **Memory Leak Hazards:**
   - `useEffect` blocks adding event listeners or observers without cleanup returns (`removeEventListener`, `disconnect`, `clearTimeout`).
2. **Non-Passive Scroll Listeners:**
   - `addEventListener("scroll", ...)` missing `{ passive: true }`.
3. **Race Condition Risks:**
   - Raw `fetch()` or `axios` calls inside JSX components instead of RTK Query services.
   - Input handlers calling API mutations directly without `useDebounce`.
4. **Unstable React Keys:**
   - Map rendering using array index `key={index}` or `Math.random()`.
5. **Layout Shift (CLS) Violations:**
   - Unmounted virtualization or list rendering missing `minHeight` container placeholders or height caching.
6. **Optimistic Update Safety:**
   - RTK Query `onQueryStarted` missing `try-catch` or `patch.undo()` rollback handler.

---

## 2. Manual Code Review Checklist

When performing a manual code review, verify the following 5 critical categories:

### Category A: Rendering & Virtualization
- [ ] Are dynamic feed items wrapped in `VirtualizedItem`?
- [ ] Is `useMeasureHeight` utilizing the global module-scoped `heightCache`?
- [ ] Are off-screen tabs preserved using CSS `display: none` rather than unmounted?
- [ ] Are heavy computational calculations wrapped in `useMemo` or `useCallback`?

### Category B: Data Fetching & Caching
- [ ] Are paginated query responses merged with `Set` deduplication (`Set.has(id)`)?
- [ ] Is input search/validation debounced using `useDebounce` (600-800ms)?
- [ ] Are all API interactions routed through RTK Query services in `src/services/`?
- [ ] Does token refreshing use lock flags (`isRefreshing`) and request queueing (`failedQueue`)?

### Category C: Memory & Cleanup Management
- [ ] Does every `useEffect` with event listeners, timers, or observers return a cleanup function?
- [ ] Are `ResizeObserver` and `IntersectionObserver` instances disconnected on unmount?

### Category D: Layout & User Experience
- [ ] Is `useLayoutEffect` used for synchronous scroll position restoration before browser paint?
- [ ] Are image placeholders or fixed aspect ratios provided to prevent layout jump (CLS = 0)?

---

## 3. How to Audit a Pull Request or Feature Code

1. Execute the automated scanner script:
   `node .agents/skills/performance-review/scripts/audit-performance.js`
2. Address any flagged warnings or anti-patterns in the report output.
3. Perform a manual review against the 4 checklist categories above.
4. Verify that no raw network calls or un-debounced event listeners exist.
