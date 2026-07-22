---
name: form-and-validation
description: Standards for React Hook Form, Zod schemas, error handling, and i18n integration.
---

# Form Management, Zod & i18n Rules

## 1. Zod Schema Conventions

Schemas are placed in `src/schemas/` with file name `[domain]Schema.js`.

```js
import * as z from "zod";
import i18n from "@/utils/i18n";

const registerSchema = z
    .object({
        username: z
            .string()
            .min(1)
            .min(3)
            .regex(/^[a-zA-Z0-9-_]+$/, i18n.t("auth:username_invalid_format")),
        email: z.string().min(1).email(),
        password: z.string().min(1).min(8),
        confirmPassword: z.string().min(1).min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: i18n.t("auth:password_mismatch"),
        path: ["confirmPassword"],
    });

export default registerSchema;
```

## 2. Using `useFormWithI18n` Custom Hook

Always use `useFormWithI18n` from `@/hooks/useFormWithI18n` instead of raw `useForm` when standardizing form validation across language switches.

```js
import { useFormWithI18n } from "@/hooks/useFormWithI18n";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "@/schemas/loginSchema";

const {
    register,
    handleSubmit,
    formState: { errors, isValid },
} = useFormWithI18n({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
});
```

## 3. Toast Notifications & i18n Keys
- Success toasts: `toast.success(t("namespace:success_key"));`
- Error toasts: `toast.error(t("namespace:error_key") || error?.data?.message);`
- Always import `useTranslation` from `react-i18next`.
