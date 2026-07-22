import { useFormWithI18n } from "@/hooks/useFormWithI18n";
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "@/schemas/registerSchema";
import {
    useRegisterMutation,
    useCheckEmailMutation,
    useCheckUsernameMutation,
} from "@/services/auth";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useWatch } from "react-hook-form";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

export function useRegisterForm() {
    const { t } = useTranslation(["auth"]);

    // State quản lý hiển thị thông báo thành công
    const [isSuccess, setIsSuccess] = useState(false);

    // State lưu email đã đăng ký
    const [submittedEmail, setSubmittedEmail] = useState("");

    /* Init Form */
    const {
        register,
        handleSubmit,
        control,
        setError,
        clearErrors,
        watch,
        trigger,
        formState: { errors, isValid },
    } = useFormWithI18n({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });

    /* 2. API Hooks */
    const [registerApi, { isLoading: isRegistering }] = useRegisterMutation();
    const [checkEmailApi, { isLoading: isCheckingEmail }] =
        useCheckEmailMutation();
    const [checkUsernameApi, { isLoading: isCheckingUsername }] =
        useCheckUsernameMutation();

    /* 3. Debounce Logic */
    // Email
    const emailValue = useWatch({ control, name: "email" });
    const debouncedEmail = useDebounce(emailValue, 800);

    // Username
    const usernameValue = useWatch({ control, name: "username" });
    const debouncedUsername = useDebounce(usernameValue, 800);

    // Effect: Check Email
    useEffect(() => {
        const validateEmail = async () => {
            if (!debouncedEmail) return;

            // Trigger validate Zod
            const isZodValid = await trigger("email");
            if (!isZodValid) return; // Nếu Zod lỗi -> Dừng, không gọi API

            try {
                const response = await checkEmailApi(debouncedEmail).unwrap();

                // Check available: false => Đã tồn tại
                if (response?.available === false) {
                    setError("email", {
                        type: "manual",
                        message: t("auth:email_exists"),
                    });
                } else {
                    clearErrors("email");
                }
            } catch (error) {
                console.error("Check email error:", error);
            }
        };
        validateEmail();
    }, [debouncedEmail, checkEmailApi, setError, clearErrors, t, trigger]);

    // Effect: Check Username
    useEffect(() => {
        const validateUsername = async () => {
            if (!debouncedUsername) return;

            const isZodValid = await trigger("username");
            if (!isZodValid) return; // Nếu Zod lỗi (VD: < 3 ký tự) -> Dừng

            try {
                const response =
                    await checkUsernameApi(debouncedUsername).unwrap();
                if (response?.available === false) {
                    setError("username", {
                        type: "manual",
                        message: t("auth:username_exists"),
                    });
                } else {
                    clearErrors("username");
                }
            } catch (error) {
                console.error("Check username error:", error);
            }
        };
        validateUsername();
    }, [debouncedUsername, checkUsernameApi, setError, clearErrors, t, trigger]);

    /* Xử lý Submit */
    const onSubmit = async (data) => {
        try {
            const payload = {
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword,
            };

            await registerApi(payload).unwrap();
            setSubmittedEmail(data.email);
            setIsSuccess(true);

            // toast.success(t("auth:register_success_msg"));
        } catch (error) {
            console.error("Register Error:", error);
            const errorMessage =
                t("auth:register_failed_default") || error?.data?.message;
            toast.error(errorMessage);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        watch,
        isLoading: isRegistering, // Loading tổng cho button submit
        isCheckingEmail, // Loading riêng cho input email
        isCheckingUsername, // Loading riêng cho input username
        isSuccess,
        submittedEmail,
    };
}
