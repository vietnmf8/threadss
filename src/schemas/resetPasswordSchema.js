import i18n from "@/utils/i18n";
import * as z from "zod";

const resetPasswordSchema = z
    .object({
        password: z.string().min(1).min(8),
        confirmPassword: z.string().min(1).min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: i18n.t("auth:password_mismatch"),
        path: ["confirmPassword"],
    });

export default resetPasswordSchema;
