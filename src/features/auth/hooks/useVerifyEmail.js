import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useVerifyEmailMutation } from "@/services/auth";
import paths from "@/configs/path";

/** Custom Hook: useVerifyEmail
 * Quản lý logic đọc token từ URL search params, gọi API verify mail tự động
 * và xử lý các trạng thái loading, lỗi, cũng như điều hướng về trang Login
 */
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
