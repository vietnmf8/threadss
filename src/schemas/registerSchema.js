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
