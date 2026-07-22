---
name: react-architecture
description: Guidelines and patterns for React 19 component structure, custom hooks, feature modularization, and Redux state management.
---

# React Architecture & Feature Modularization

## 1. Feature Modularization Pattern

All business domain features MUST be placed in `src/features/[feature_name]/`.

### Directory Structure Example
```
src/features/auth/
├── authSlice.js
├── components/
│   ├── GuestLoginDialog.jsx
│   ├── InstagramLoginButton.jsx
│   └── LoginQRCode.jsx
└── hooks/
    ├── useLoginForm.js
    ├── useRegisterForm.js
    ├── useQuickLogin.js
    └── useGuestLogin.js
```

### Component Rules
- Components MUST focus purely on layout and rendering JSX.
- All state initialization, API mutation hooks, handlers, navigation, and toast triggers MUST be encapsulated in a dedicated custom hook.

### Custom Hook Pattern Example
```js
import { useFormWithI18n } from "@/hooks/useFormWithI18n";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "@/schemas/loginSchema";
import { useLoginMutation } from "@/services/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import paths from "@/configs/path";
import toast from "react-hot-toast";

export function useLoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formMethods = useFormWithI18n({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const [loginApi, { isLoading }] = useLoginMutation();

    const onSubmit = async (data) => {
        try {
            const result = await loginApi(data).unwrap();
            if (result) {
                toast.success("Success");
                navigate(paths.home);
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed");
        }
    };

    return {
        ...formMethods,
        handleSubmit: formMethods.handleSubmit(onSubmit),
        isLoading,
    };
}
```

## 2. Redux Store & Slice Rules
- Slice files live in `src/features/[feature]/[feature]Slice.js`.
- Always import slices into `src/store.js`.
- Access store state via `useSelector((state) => state.[feature])`.
- Dispatch actions via `useDispatch()`.
