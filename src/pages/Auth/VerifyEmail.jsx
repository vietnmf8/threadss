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
