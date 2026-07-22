# AGENTS.md - Workspace Coding Rules & Guidelines

> **Project Name:** Threads Clone (React 19 + Vite + Redux Toolkit + Tailwind CSS v4)
> **Primary Language:** JavaScript (ES6+, JSX)
> **Key Frameworks & Libraries:** React 19, Redux Toolkit (RTK Query), Tailwind CSS v4, Shadcn/UI, React Hook Form, Zod, i18next, React Router v7.

---

## 1. Project Directory & Naming Conventions

### Directory Layout
- `src/assets/`: Static assets, SVG icons barrel export (`src/assets/icons.jsx`).
- `src/components/`: Shared UI components without feature-specific business logic.
  - `ui/`: Shadcn UI base primitives (`button.jsx`, `dialog.jsx`, `input.jsx`, `dropdown-menu.jsx`).
  - `common/`: Shared layout/utility components (`SplashScreen.jsx`, `Private.jsx`).
  - `layout/`: Global layout sub-components (`AuthFooter.jsx`).
- `src/configs/`: Configuration constants (`path.js`, `feedTabs.js`).
- `src/contexts/`: React Context providers (if required).
- `src/features/`: **Feature-first modular directory**. Each domain feature (`auth`, `post`, `settings`, `app`) MUST be encapsulated here:
  - `src/features/[feature_name]/[feature_name]Slice.js`: Redux Toolkit slice.
  - `src/features/[feature_name]/components/`: Feature-specific UI components.
  - `src/features/[feature_name]/hooks/`: Feature-specific custom hooks.
- `src/hooks/`: Global custom hooks (`useFormWithI18n.js`, `useTheme.js`, `useClearApiCache.js`).
- `src/layouts/`: Router layout wrappers (`AuthLayout.jsx`, `DefaultLayout.jsx`).
- `src/lib/`: Library utilities (`utils.js` exporting `cn()`).
- `src/pages/`: Route page components (`src/pages/Auth/Login.jsx`, `src/pages/Home/index.jsx`).
- `src/schemas/`: Zod validation schemas (`loginSchema.js`, `registerSchema.js`).
- `src/services/`: Data fetching & API service layer (`httpRequest.js`, `baseQuery.js`, `auth.js`, `post.js`).
- `src/store.js`: Centralized Redux store configuration.
- `src/utils/`: Global utility helpers (`httpRequest.js`, `i18n.js`).

### File & Symbol Naming Rules
- **React Components / Layouts:** `PascalCase.jsx` (e.g., `PostCard.jsx`, `LoginForm.jsx`, `AuthLayout.jsx`).
- **Custom Hooks:** `camelCase.js` starting with `use` (e.g., `useLoginForm.js`, `useHomeFeed.js`).
- **Redux Slices:** `[feature]Slice.js` in camelCase (e.g., `authSlice.js`, `postSlice.js`).
- **Services / API Files:** `camelCase.js` (e.g., `auth.js`, `post.js`, `baseQuery.js`).
- **Schemas:** `camelCaseSchema.js` (e.g., `loginSchema.js`, `registerSchema.js`).
- **Variables & Functions:** `camelCase` (e.g., `isLoggingIn`, `handleHeaderRefetch`, `updatePostCache`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `END_POINT`, `FEED_TABS`, `SPLASH_PATHS`).
- **Path Aliases:** ALWAYS use `@/` alias for `src/` (e.g., `import { cn } from "@/lib/utils";`).

---

## 2. Coding Style & Formatting Rules

- **Communication Language:** MUST use 100% Vietnamese language in all chat communications and reports with the USER without exception.
- **Indentation:** 4 spaces (Configured via `.prettierrc`).
- **Quotes:** Double quotes `"..."` for imports and string literals.
- **Semicolons:** ALWAYS include semicolons `;`.
- **Export Pattern:**
  - `export default ComponentName;` for React component files.
  - `export function useXyz()` or `export const xyz = ...` for custom hooks, utilities, and schemas.
  - `export const { useXyzMutation } = apiService;` for RTK Query hooks.
- **Comment Conventions:**
  - Use block comments `/* Description */` or JSDoc `/** Custom Hook: name */` for functions & custom hooks.
  - Group code sections with clear comment markers (e.g., `/* 1. Init Form */`, `/* API Hooks */`, `/* Handlers */`).

---

## 3. Core Architecture Rules

### A. Separation of Concerns (Container vs Presentation & Custom Hooks)
- Components MUST stay clean and presentational.
- Complex business logic, API calls, form handling, and navigation MUST be extracted into custom hooks inside `src/features/[feature]/hooks/` or `src/hooks/`.

### B. API Calls & Service Layer
- **RTK Query Only:** ALL API communication MUST go through RTK Query services in `src/services/`.
- **Base Query:** APIs MUST use `baseQuery` (`src/services/baseQuery.js`), which wraps `httpRequest` (`src/utils/httpRequest.js`).
- **Axios Interceptor:** Token authentication (Bearer) and automatic Refresh Token logic are handled centrally by `httpRequest`. Do NOT duplicate token logic in components.
- **Optimistic Updates:** Use RTK Query `onQueryStarted` and `updateQueryData` for instant UI feedback (like/repost actions).

### C. Forms & Validation
- Use **React Hook Form** + **Zod** (`@hookform/resolvers/zod`).
- Wrap form initialization with `useFormWithI18n` (`@/hooks/useFormWithI18n`) to automatically trigger re-validation when switching languages.
- Validation messages MUST be internationalized using `i18n.t("namespace:key")`.

### D. UI & Styling (Tailwind CSS v4 + Shadcn/UI)
- **Tailwind CSS v4:** Styles are defined with `@theme inline` in `src/index.css`. Use CSS variable tokens (`bg-threads-bg`, `text-threads-text`, `border-threads-border`).
- **Class Merging:** ALWAYS use `cn(...)` from `@/lib/utils` for conditional or dynamic className props.
- **Variants:** Use `cva` (class-variance-authority) for multi-variant UI components (e.g., `Button`).

### E. Performance Optimization Standards
- **Virtualized Feeds:** Long lists MUST use `VirtualizedItem` + `useMeasureHeight` (`ResizeObserver`) + `minHeight` container placeholders to prevent layout shift (CLS = 0).
- **Anti-Flicker & Freeze State:** Off-screen tabs freeze virtualization updates. Use 50-100ms debounce before toggling DOM unmounts.
- **Tab Keep-Alive & Zero-Flicker Scroll:** Preserve tab subtrees in DOM using `display: none` / `display: block`. Snapshot and restore scroll position with `useLayoutEffect`.
- **Cache Deduplication:** Merge paginated query results with `Set` lookup to prevent duplicate items.

---

## 4. Prohibited Patterns (Anti-Patterns)

❌ **NO Raw API Calls:** Never use raw `fetch()` or `axios.get()` inside React components or hooks directly. Use RTK Query mutations/queries.  
❌ **NO Inline Business Logic:** Never write massive `useEffect`, form submission, or state manipulation directly inside JSX component render functions. Extract into custom hooks.  
❌ **NO Hardcoded Paths:** Never hardcode route strings like `"/login"` or `"/home"`. Always use `paths` from `@/configs/path`.  
❌ **NO Hardcoded Static Text for Error Messages:** Never display raw hardcoded English/Vietnamese string literals for form errors or API toast notifications. Always use `i18n.t(...)` or `t("namespace:key")`.  
❌ **NO TypeScript (.ts/.tsx):** This project uses standard JavaScript (React 19 ES6+ JS/JSX). Do NOT generate TypeScript files or annotations.  
❌ **NO Direct State Mutation:** Never mutate Redux state directly outside RTK Toolkit reducers/drafts.  
❌ **NO Uncached Virtualization Heights:** Never unmount virtualized items without preserving their container pixel height to avoid scroll jumping.

---

## 5. Detailed Modular Skills

For specific implementation deep-dives, consult the following specialized skill guides:
- [React Architecture & Feature Modularization](file:///.agents/skills/react-architecture/SKILL.md)
- [API & Services (RTK Query & Axios)](file:///.agents/skills/api-and-services/SKILL.md)
- [Form Management, Zod & i18n](file:///.agents/skills/form-and-validation/SKILL.md)
- [UI Styling, Tailwind v4 & Shadcn](file:///.agents/skills/ui-and-styling/SKILL.md)
- [Performance Optimization Standards](file:///.agents/skills/performance-optimization/SKILL.md)
- [Performance Audit & Review](file:///.agents/skills/performance-review/SKILL.md)
- [Comprehensive Verification](file:///.agents/skills/verification/SKILL.md)
- [Lessons Learned & Bug Prevention](file:///.agents/skills/lessons-learned/SKILL.md)
