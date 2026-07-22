import { useFormWithI18n } from "@/hooks/useFormWithI18n";
import { zodResolver } from "@hookform/resolvers/zod";
import forgotPasswordSchema from "@/schemas/forgotPasswordSchema";
import { useForgotPasswordMutation } from "@/services/auth";
import { useLocation } from "react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function useForgotPasswordForm() {
    const location = useLocation();
    const { t } = useTranslation(["auth"]);

    // State quản lý trạng thái thành công & email đã submit
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    // Lấy email từ state (nếu có - ví dụ chuyển từ trang Login sang)
    const defaultEmail = location.state?.email || "";

    /* Init Form */
    const {
        register,
        handleSubmit,
        trigger,
        setError,
        formState: { errors, isValid },
    } = useFormWithI18n({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: defaultEmail,
        },
    });

    /* Effect: Validate ngay lập tức nếu có email pre-fill */
    useEffect(() => {
        if (defaultEmail) {
            trigger("email");
        }
    }, [defaultEmail, trigger]);

    /* API Hook */
    const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();

    /* Xử lý Submit */
    const onSubmit = async (data) => {
        try {
            await forgotPasswordApi({ email: data.email }).unwrap();

            // Chuyển sang màn hình Success
            setSubmittedEmail(data.email);
            setIsSuccess(true);
        } catch (error) {
            console.error("Forgot Password Error:", error);

            // Xử lý lỗi từ Server trả về
            const validationErrors = error?.data?.errors;

            // Case 422: Lỗi Validation từ Server
            if (validationErrors?.email) {
                setError("email", {
                    type: "server",
                    message: t("auth:email_invalid_server"), // "Email không hợp lệ hoặc không tồn tại."
                });
            } else {
                // Case khác (500, Network error...): Hiển thị Toast thông báo chung
                const errorMessage =
                    t("auth:link_sent_failed") || error?.data?.message;
                toast.error(errorMessage);
            }
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        isLoading,
        isSuccess, // Trả về trạng thái thành công
        submittedEmail, // Trả về email đã gửi thành công
    };
}
