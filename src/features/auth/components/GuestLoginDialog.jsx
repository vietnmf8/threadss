import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { CloseIcon, LoadingIcon, NextIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useQuickLogin } from "../hooks/useQuickLogin";
import { useNavigate } from "react-router";
import paths from "@/configs/path";

/**
 * Hộp thoại yêu cầu đăng nhập khi khách truy cập các trang giới hạn.
 */
function GuestLoginDialog({ open, onOpenChange }) {
    const { t } = useTranslation(["auth"]);
    const navigate = useNavigate();
    const { lastUser, isLoading, handleQuickLogin } = useQuickLogin();

    /* Data hiển thị */
    const displayUsername = lastUser?.username || "";
    const displayAvatar = lastUser?.avatar_url;

    // Check user tồn tại
    const hasUser = !!lastUser;

    const handleClick = async () => {
        if (isLoading) return;

        if (hasUser) {
            // Returning Guest
            await handleQuickLogin();
            onOpenChange(false);
        } else {
            // New Guest
            navigate(paths.login);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "top-auto right-0 bottom-0 left-0",
                    "translate-x-0 translate-y-0",
                    "border-threads-border bg-threads-content-bg w-full max-w-full gap-0 overflow-hidden border-t p-0",
                    "rounded-t-2xl rounded-b-none",
                    "data-[state=open]:slide-in-from-bottom-full duration-150 ease-out",
                    "data-[state=open]:zoom-in-100",
                    "sm:max-w-full",
                    "md:top-[50%] md:right-auto md:bottom-auto md:left-[50%]",
                    "md:translate-x-[-50%] md:translate-y-[-50%]",
                    "md:w-130 md:max-w-130",
                    "md:rounded-2xl md:border-none",
                    "md:duration-200",
                    "md:data-[state=open]:slide-in-from-bottom-0",
                    "md:data-[state=open]:zoom-in-95",
                    "md:data-[state=open]:fade-in-0",
                )}
                showCloseButton={false}
                aria-describedby={undefined}
            >
                <DialogTitle className="sr-only">Guest Login</DialogTitle>
                <DialogDescription className="sr-only">
                    Login Request
                </DialogDescription>

                {/* Close */}
                <DialogClose
                    className={cn(
                        "group absolute top-6 left-6 z-10 flex h-9 w-9 cursor-pointer items-center justify-center md:hidden",
                        "text-threads-text transition-transform active:scale-95",
                    )}
                >
                    <div className="absolute inset-0 m-auto h-9 w-9 scale-0 rounded-full bg-black/5 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-white/10" />

                    {/* Icon */}
                    <CloseIcon className="text-threads-icon-out relative z-10 h-4 w-4" />
                </DialogClose>

                {/* Main Content */}
                <div className="flex h-auto w-full flex-col p-6 md:p-0 md:px-14 md:pt-12 md:pb-14">
                    <div className="h-9 w-full md:hidden" />
                    {/* Title & Description */}
                    <div className="mx-auto flex max-w-full flex-col items-center pb-8 text-center md:max-w-84">
                        <span
                            className={cn(
                                "text-threads-text block pb-3 leading-[1.4] text-balance wrap-break-word",
                                "font-bold md:font-extrabold",
                                "text-[24px] md:text-[32px]",
                            )}
                        >
                            {t("auth:guest_dialog_title")}
                        </span>
                        <span className="text-threads-dim block max-w-84 text-[15px] leading-[1.4] font-normal text-pretty wrap-break-word">
                            {t("auth:guest_dialog_desc")}
                        </span>
                    </div>

                    {/* CTA Button */}
                    <div
                        onClick={handleClick}
                        className={cn(
                            "border-threads-border relative flex w-full cursor-pointer items-center rounded-2xl border px-3 py-5 transition-colors select-none md:py-5 md:pr-3 md:pl-5",
                            isLoading && "cursor-not-allowed opacity-70",
                        )}
                    >
                        {displayAvatar ? (
                            <div className="relative flex h-11.25 w-11.25 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                                <img
                                    src={displayAvatar}
                                    alt={displayUsername}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="h-11.25 w-11.25 shrink-0 bg-auto bg-position-[0px_0px] bg-no-repeat"
                                style={{
                                    backgroundImage:
                                        "url('https://static.cdninstagram.com/rsrc.php/v4/yR/r/5XQu87_RU36.png')",
                                }}
                            />
                        )}

                        <div
                            className={cn(
                                "flex min-w-0 flex-1 flex-col items-start",
                                hasUser ? "pl-5" : "pl-2",
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

                            {hasUser && (
                                <span className="text-threads-text w-full truncate text-left text-[15px] font-semibold">
                                    {displayUsername}
                                </span>
                            )}
                        </div>

                        <div className="text-threads-icon-out shrink-0 p-2">
                            {isLoading ? (
                                <LoadingIcon className="text-threads-text h-4 w-4 animate-spin" />
                            ) : (
                                <NextIcon className="h-4 w-4" />
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

GuestLoginDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
};

export default GuestLoginDialog;
