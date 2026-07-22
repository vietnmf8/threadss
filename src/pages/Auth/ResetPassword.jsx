import React from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
    useResetPasswordMutation,
    useValidateResetTokenQuery,
} from "@/services/auth";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { Button } from "@/components/ui/button";
import paths from "@/configs/path";
import { useTranslation } from "react-i18next";
import { LoadingIcon, ThreadsIcon } from "@/assets/icons";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

function ResetPassword() {
    const { t } = useTranslation(["auth"]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    /* Validate Token ngay khi vào trang */
    const {
        data: responseData,
        isLoading: isChecking,
        isError: isApiError,
        isSuccess: isApiSuccess,
    } = useValidateResetTokenQuery(token, {
        skip: !token,
    });

    /* Setup API Reset Password */
    const [resetPasswordApi, { isLoading: isSubmitting }] =
        useResetPasswordMutation();

    /* Logic xác định trạng thái Token */
    const isTokenValid = isApiSuccess && responseData?.valid === true;
    const isTokenInvalid =
        isApiError || (isApiSuccess && responseData?.valid === false);

    /* Handle Submit */
    const handleResetPassword = async (data) => {
        if (!token) return;

        try {
            await resetPasswordApi({
                token,
                password: data.password,
                password_confirmation: data.confirmPassword,
            }).unwrap();

            navigate(paths.login, {
                state: {
                    message: t("auth:reset_password_success"),
                },
            });
        } catch (error) {
            console.error("Reset password failed:", error);
            toast.error(t("auth:token_invalid") || error?.data?.message);
        }
    };

    const BACK_BTN_CLASSES = cn(
        "h-13.5 w-full cursor-pointer rounded-xl text-[15px] font-semibold transition-all",
        "bg-threads-button-bg text-threads-button-text",
        "hover:bg-threads-button-bg active:scale-95",
    );

    /* UI chung cho trường hợp Lỗi/Thiếu Token */
    const ErrorState = () => (
        <div className="flex w-full flex-col items-center px-4 min-[520px]:px-0">
            <div className="mb-4 hidden items-center justify-center min-[520px]:flex">
                <ThreadsIcon className="text-threads-text h-15 w-15" />
            </div>

            <p className="text-threads-text mb-6 text-center text-[15px] font-medium">
                {t("auth:token_invalid")}
            </p>

            <Button
                onClick={() => navigate(paths.login)}
                className={BACK_BTN_CLASSES}
            >
                {t("auth:back_to_login_btn")}
            </Button>
        </div>
    );

    /* Case 0: Không có token trên URL */
    if (!token) {
        return <ErrorState />;
    }

    /* Case 1: Đang validate token */
    if (isChecking) {
        return (
            <div className="flex flex-col items-center gap-4">
                <LoadingIcon className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-threads-dim">{t("auth:validating_token")}</p>
            </div>
        );
    }

    /* Case 2: Token không hợp lệ */
    if (isTokenInvalid) {
        return <ErrorState />;
    }

    /* Case 3: Token hợp lệ -> Hiển thị Form */
    if (isTokenValid) {
        return (
            <ResetPasswordForm
                onSubmit={handleResetPassword}
                isLoading={isSubmitting}
            />
        );
    }

    return null;
}

export default ResetPassword;
