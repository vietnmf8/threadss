import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import paths from "@/configs/path";
import { InstagramIcon, LoadingIcon } from "@/assets/icons";
import { useQuickLogin } from "@/features/auth/hooks/useQuickLogin";
import { cn } from "@/lib/utils";

function LoginPanel() {
    const { t } = useTranslation(["auth"]);
    const navigate = useNavigate();
    const { lastUser, isLoading, handleQuickLogin } = useQuickLogin();

    // Data hiển thị
    const displayUsername = lastUser?.username || "";
    const displayAvatar = lastUser?.avatar_url;

    // Kiểm tra có user cũ không
    const hasUser = !!lastUser;

    const handleClick = async () => {
        if (isLoading) return;

        if (hasUser) {
            // Returning Guest
            await handleQuickLogin();
        } else {
            // New Guest
            navigate(paths.login);
        }
    };

    return (
        <div className="bg-threads-dropdown-hover border-threads-border sticky top-15 mx-3 mt-15 box-content hidden w-[288px] flex-col items-center rounded-3xl border px-6 pt-8 pb-7 md:flex dark:bg-[#1e1e1e]">
            {/* Title */}
            <h2 className="text-threads-text text-center text-xl leading-6.25 font-bold">
                {t("auth:guest_login_title")}
            </h2>

            {/* Description */}
            <p className="text-threads-dim text-threads-base mt-3 text-center leading-5.25 font-normal">
                {t("auth:guest_login_desc")}
            </p>

            {/* CTA */}
            <div
                className={cn(
                    "bg-threads-content-bg mt-6 w-full cursor-pointer rounded-[20px] transition-colors dark:bg-[#101010]",
                    isLoading && "cursor-not-allowed opacity-70",
                    hasUser ? "px-7 py-5" : "p-7",
                )}
                onClick={handleClick}
            >
                <div className="flex items-center gap-3.5">
                    {isLoading ? (
                        <LoadingIcon className="text-threads-text size-6 animate-spin" />
                    ) : displayAvatar ? (
                        <img
                            src={displayAvatar}
                            alt={displayUsername}
                            className="size-6 rounded-full object-cover"
                        />
                    ) : (
                        <InstagramIcon className="size-6" />
                    )}
                    <div className="flex flex-col">
                        <span
                            className={cn(
                                "text-[15px] leading-5.25",
                                hasUser
                                    ? "text-threads-dim text-left font-normal"
                                    : "text-threads-text text-center font-bold",
                            )}
                        >
                            {t("auth:continue_with_instagram")}
                        </span>

                        {hasUser && (
                            <span className="text-threads-text text-threads-base leading-5.25 font-semibold">
                                {displayUsername}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div
                className="text-threads-dim text-threads-base mt-6 cursor-pointer font-normal hover:underline"
                onClick={() => navigate(paths.login)}
            >
                {t("auth:login_with_username")}
            </div>
        </div>
    );
}

export default LoginPanel;
