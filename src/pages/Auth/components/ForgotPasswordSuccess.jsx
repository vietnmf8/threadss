import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { ThreadsIcon } from "@/assets/icons";
import EmailHighlight from "./EmailHighlight";
import { useForgotPasswordMutation } from "@/services/auth";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

function ForgotPasswordSuccess({ email }) {
    const { t } = useTranslation(["auth"]);

    /* Bắt đầu đếm ngược 60s ngay khi mount component  */
    const [countdown, setCountdown] = useState(60);

    /* API Gửi lại email */
    const [forgotPasswordApi, { isLoading: isResending }] =
        useForgotPasswordMutation();

    /* Effect: Xử lý đếm ngược */
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        // Cleanup: Xóa timer khi component unmount hoặc countdown thay đổi
        return () => clearTimeout(timer);
    }, [countdown]);

    /* Handle: Gửi lại email */
    const handleResendEmail = async () => {
        if (countdown > 0 || isResending) return;

        try {
            await forgotPasswordApi({ email }).unwrap();
            toast.success(t("auth:link_sent_success"));
            setCountdown(60); // Reset bộ đếm 60s
        } catch (error) {
            console.error("Resend failed", error);
            toast.error(t("auth:link_sent_failed"));
        }
    };

    return (
        <div className="flex w-full flex-col items-center px-4 text-center min-[520px]:px-0">
            {/* Logo */}
            <div className="mb-4 hidden items-center justify-center min-[520px]:flex">
                <ThreadsIcon className="text-threads-text h-15 w-15" />
            </div>

            {/* Title */}
            <h2 className="text-threads-text mb-2 text-xl font-bold">
                {t("auth:forgot_password_success_title")}
            </h2>

            {/* Desc  */}
            <div className="text-threads-dim flex flex-col items-center text-[15px] leading-relaxed md:block md:max-w-105 md:text-balance">
                <Trans
                    i18nKey="auth:forgot_password_success_desc"
                    values={{ email }}
                    components={{
                        highlight: <EmailHighlight />,
                    }}
                />
            </div>

            <div className="my-3 h-px w-16 bg-gray-200 dark:bg-gray-800" />

            {/* Nút hành động phụ: Gửi lại email  */}
            <button
                type="button"
                onClick={handleResendEmail}
                disabled={countdown > 0 || isResending}
                className={cn(
                    "text-threads-dim text-[14px] font-medium transition-colors",
                    countdown > 0 || isResending
                        ? "cursor-not-allowed opacity-50"
                        : "hover:text-threads-text",
                )}
            >
                {countdown > 0
                    ? t("auth:resend_email_wait", { seconds: countdown })
                    : isResending
                      ? t("auth:sending_link")
                      : t("auth:resend_email")}
            </button>
        </div>
    );
}

ForgotPasswordSuccess.propTypes = {
    email: PropTypes.string.isRequired,
};

export default ForgotPasswordSuccess;
