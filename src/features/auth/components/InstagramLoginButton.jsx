import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { LoadingIcon, NextIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";

function InstagramLoginButton({ className, onClick, userInfo, isLoading }) {
    const { t } = useTranslation(["auth"]);

    /* Xác định nội dung hiển thị: User info thực tế hoặc mặc định */
    const displayUsername = userInfo?.username || "";
    const displayAvatar = userInfo?.avatar_url;

    // Kiểm tra xem có user cũ hay không để xác định style
    const hasUser = !!userInfo;

    /* Logic hiển thị icon/ảnh */
    const renderIconOrAvatar = () => {
        if (displayAvatar) {
            return (
                <img
                    src={displayAvatar}
                    alt={displayUsername}
                    className="h-full w-full rounded-full object-cover"
                />
            );
        }
        // Mặc định logo Instagram nếu không có avatar
        return (
            <div
                className="absolute h-full w-full origin-center bg-auto bg-position-[0px_-57px] bg-no-repeat"
                style={{
                    backgroundImage:
                        "url(\"https://static.cdninstagram.com/rsrc.php/y-/r/3i9QkhvTpGM.webp\")",
                }}
            />
        );
    };

    return (
        <div
            onClick={isLoading ? undefined : onClick}
            className={cn(
                "border-threads-border relative flex w-full cursor-pointer items-center rounded-2xl border px-3 py-5 pr-3 pl-5 transition-colors select-none",
                isLoading && "cursor-not-allowed opacity-70",
                className,
            )}
        >
            {/* Logo / Avatar */}
            <div className="relative flex h-11.25 w-11.25 shrink-0 items-center justify-center overflow-hidden">
                {renderIconOrAvatar()}
            </div>

            {/* Text Content */}
            <div
                className={cn(
                    "flex min-w-0 flex-1 flex-col items-start",
                    hasUser ? "pl-4" : "pl-2",
                )}
            >
                <span
                    className={cn(
                        "w-full text-[15px]",
                        hasUser
                            ? "text-threads-dim truncate text-left font-normal"
                            : "text-threads-text text-center text-[16px] font-bold",
                    )}
                >
                    {t("auth:continue_with_instagram")}
                </span>

                {/* Chỉ hiển thị username nếu có user */}
                {hasUser && (
                    <span className="text-threads-text w-full truncate text-left text-[15px] font-semibold">
                        {displayUsername}
                    </span>
                )}
            </div>

            {/* Arrow Icon / Loading */}
            <div className="text-threads-icon-out shrink-0 p-2">
                {isLoading ? (
                    <LoadingIcon className="text-threads-text h-4 w-4 animate-spin" />
                ) : (
                    <NextIcon className="h-4 w-4" />
                )}
            </div>
        </div>
    );
}

InstagramLoginButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    userInfo: PropTypes.shape({
        username: PropTypes.string,
        avatar_url: PropTypes.string,
    }),
    isLoading: PropTypes.bool,
};

export default InstagramLoginButton;
