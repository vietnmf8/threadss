# VerifyEmail Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/verify-email` page to automatically parse email verification tokens from URL params, trigger the backend API, handle loading and error states, and redirect to `/login` with a success message banner between title and email input.

**Architecture:** Add `verifyEmail` RTK Query mutation in `auth.js`, create a custom hook `useVerifyEmail` to isolate URL parameter parsing and state management, implement `VerifyEmail.jsx` for status UI, and update `LoginForm.jsx` to display success alerts.

**Tech Stack:** React 19, React Router v7, Redux Toolkit Query, Tailwind CSS v4, i18next.

## Global Constraints
- Standard JavaScript ES6+ (React 19, `.jsx` / `.js`). No TypeScript.
- Use `@/` import alias for `src/`.
- Extract complex logic into custom hooks in `src/features/auth/hooks/`.
- Use `i18n.t` / `useTranslation` for all text strings.

---

### Task 1: Update i18n Translation Files

**Files:**
- Modify: `public/locales/vi/auth.json`
- Modify: `public/locales/en/auth.json`

**Interfaces:**
- Consumes: Existing translation keys in `auth.json`
- Produces: `auth:verifying_email`, `auth:verify_email_failed`, `auth:verify_email_success`, `auth:go_to_login_btn`

- [ ] **Step 1: Add translation keys to `public/locales/vi/auth.json`**

Add the following keys before the closing brace in `public/locales/vi/auth.json`:
```json
    "verifying_email": "Đang xác minh...",
    "verify_email_failed": "Liên kết đã hết hạn hoặc không hợp lệ.",
    "verify_email_success": "Đã xác minh tài khoản thành công. Vui lòng đăng nhập.",
    "go_to_login_btn": "Đi tới trang đăng nhập"
```

- [ ] **Step 2: Add translation keys to `public/locales/en/auth.json`**

Add the following keys before the closing brace in `public/locales/en/auth.json`:
```json
    "verifying_email": "Verifying...",
    "verify_email_failed": "Invalid or expired link.",
    "verify_email_success": "Account verified successfully. Please log in.",
    "go_to_login_btn": "Go to login page"
```

- [ ] **Step 3: Commit**

```bash
git add public/locales/vi/auth.json public/locales/en/auth.json
git commit -m "i18n: add translation keys for email verification"
```

---

### Task 2: Update Path Config & Auth API Service

**Files:**
- Modify: `src/configs/path.js`
- Modify: `src/services/auth.js`

**Interfaces:**
- Consumes: RTK Query `createApi` and `baseQuery`
- Produces: `paths.verify_email`, `useVerifyEmailMutation` hook

- [ ] **Step 1: Add `verify_email` path to `src/configs/path.js`**

In `src/configs/path.js`, add `verify_email` to `paths`:
```javascript
const paths = {
    /* Auth */
    login: "/login",
    register: "/register",
    forgot_password: "/forgot-password",
    reset_password: "/reset-password",
    verify_email: "/verify-email",
```

- [ ] **Step 2: Add `verifyEmail` mutation to `src/services/auth.js`**

In `src/services/auth.js`, add endpoint inside `endpoints`:
```javascript
        /* Xác thực Email */
        verifyEmail: builder.mutation({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "POST",
                body,
            }),
        }),
```

Export `useVerifyEmailMutation` at the bottom:
```javascript
export const {
    useRegisterMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useMeQuery,
    useLazyMeQuery,
    useCheckEmailMutation,
    useCheckUsernameMutation,
    useValidateResetTokenQuery,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useVerifyEmailMutation,
} = authApi;
```

- [ ] **Step 3: Commit**

```bash
git add src/configs/path.js src/services/auth.js
git commit -m "feat(auth): add verify_email path and verifyEmail mutation"
```

---

### Task 3: Create Custom Hook `useVerifyEmail`

**Files:**
- Create: `src/features/auth/hooks/useVerifyEmail.js`

**Interfaces:**
- Consumes: `useSearchParams`, `useNavigate` from `react-router`, `useTranslation` from `react-i18next`, `useVerifyEmailMutation` from `@/services/auth`, `paths` from `@/configs/path`
- Produces: Custom hook returning `{ token, isVerifying, isError, handleGoToLogin }`

- [ ] **Step 1: Write `src/features/auth/hooks/useVerifyEmail.js`**

Create `src/features/auth/hooks/useVerifyEmail.js`:
```javascript
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useVerifyEmailMutation } from "@/services/auth";
import paths from "@/configs/path";

export function useVerifyEmail() {
    const { t } = useTranslation(["auth"]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [verifyEmailApi, { isLoading: isVerifying, isError }] =
        useVerifyEmailMutation();

    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        if (!token || hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;

        const performVerification = async () => {
            try {
                await verifyEmailApi({ token }).unwrap();
                navigate(paths.login, {
                    replace: true,
                    state: {
                        verifySuccessMessage: t("auth:verify_email_success"),
                    },
                });
            } catch (err) {
                console.error("Email verification failed:", err);
            }
        };

        performVerification();
    }, [token, verifyEmailApi, navigate, t]);

    const handleGoToLogin = () => {
        navigate(paths.login);
    };

    const isInvalid = !token || isError;

    return {
        token,
        isVerifying,
        isError: isInvalid,
        handleGoToLogin,
    };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/hooks/useVerifyEmail.js
git commit -m "feat(auth): create useVerifyEmail custom hook"
```

---

### Task 4: Create VerifyEmail Page Component & Add Route

**Files:**
- Create: `src/pages/Auth/VerifyEmail.jsx`
- Modify: `src/routes.js`

**Interfaces:**
- Consumes: `useVerifyEmail` hook from `@/features/auth/hooks/useVerifyEmail`, UI elements from `@/components/ui/button`, icons from `@/assets/icons`
- Produces: `VerifyEmail` page component registered under `AuthLayout` route

- [ ] **Step 1: Create `src/pages/Auth/VerifyEmail.jsx`**

Create `src/pages/Auth/VerifyEmail.jsx`:
```jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LoadingIcon, ThreadsIcon } from "@/assets/icons";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import { cn } from "@/lib/utils";

function VerifyEmail() {
    const { t } = useTranslation(["auth"]);
    const { isVerifying, isError, handleGoToLogin } = useVerifyEmail();

    const BTN_CLASSES = cn(
        "h-13.5 w-full cursor-pointer rounded-xl text-[15px] font-semibold transition-all",
        "bg-threads-button-bg text-threads-button-text",
        "hover:bg-threads-button-bg active:scale-95",
    );

    /* Case 1: Đang xác minh */
    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <LoadingIcon className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-threads-dim text-[15px] font-medium">
                    {t("auth:verifying_email")}
                </p>
            </div>
        );
    }

    /* Case 2: Xác minh thất bại / Token không hợp lệ */
    if (isError) {
        return (
            <div className="flex w-full flex-col items-center px-4 min-[520px]:px-0">
                <div className="mb-4 hidden items-center justify-center min-[520px]:flex">
                    <ThreadsIcon className="text-threads-text h-15 w-15" />
                </div>

                <p className="mb-6 text-center text-[15px] font-medium text-red-500">
                    {t("auth:verify_email_failed")}
                </p>

                <Button onClick={handleGoToLogin} className={BTN_CLASSES}>
                    {t("auth:go_to_login_btn")}
                </Button>
            </div>
        );
    }

    return null;
}

export default VerifyEmail;
```

- [ ] **Step 2: Add `VerifyEmail` route to `src/routes.js`**

In `src/routes.js`:
Add lazy import:
```javascript
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
```
Add route item under `AuthLayout`:
```javascript
    {
        layout: AuthLayout,
        children: [
            { path: paths.register, component: Register },
            { path: paths.login, component: Login },
            { path: paths.forgot_password, component: ForgotPassword },
            { path: paths.reset_password, component: ResetPassword },
            { path: paths.verify_email, component: VerifyEmail },
        ],
    },
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/Auth/VerifyEmail.jsx src/routes.js
git commit -m "feat(auth): create VerifyEmail page component and register route"
```

---

### Task 5: Update `LoginForm.jsx` to Render Success Message Banner

**Files:**
- Modify: `src/pages/Auth/components/LoginForm.jsx`

**Interfaces:**
- Consumes: `useLocation` from `react-router`
- Produces: Banner display between `login_title` and `email` input when `location.state?.verifySuccessMessage` exists

- [ ] **Step 1: Update `LoginForm.jsx`**

In `src/pages/Auth/components/LoginForm.jsx`:
1. Import `useLocation` from `"react-router"`.
2. Inside `LoginForm` component, call `const location = useLocation();`
3. Get `verifySuccessMessage = location.state?.verifySuccessMessage;`
4. Render the message banner right after the title div (`<div className="mb-4 text-center">...</div>`):

```jsx
            {/* Banner Thông Báo Xác Minh Email Thành Công */}
            {verifySuccessMessage && (
                <div className="mb-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                    <p className="text-[14px] font-medium leading-tight text-emerald-500">
                        {verifySuccessMessage}
                    </p>
                </div>
            )}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Auth/components/LoginForm.jsx
git commit -m "feat(auth): display verify success message banner on LoginForm"
```

---

### Task 6: Manual Verification & Update Task Checklist

**Files:**
- Modify: `docs/task-checklist.md`

- [ ] **Step 1: Check build & run dev server**
Run build or check console in dev server to verify no syntax errors or broken imports.

- [ ] **Step 2: Update `docs/task-checklist.md`**
Mark task ## 10 items as completed `[x]`.

- [ ] **Step 3: Commit**
```bash
git add docs/task-checklist.md
git commit -m "docs: update task checklist for task 10"
```
