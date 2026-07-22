import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router";
import paths from "@/configs/path";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import InstagramLoginButton from "@/features/auth/components/InstagramLoginButton";
import { LoadingIcon } from "@/assets/icons";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { useQuickLogin } from "@/features/auth/hooks/useQuickLogin";

function LoginForm() {
    const { t } = useTranslation(["auth", "common"]);
    const location = useLocation();
    const verifySuccessMessage = location.state?.verifySuccessMessage;

    const { register, handleSubmit, errors, isValid, isLoading, watch } =
        useLoginForm();

    const {
        lastUser,
        isLoading: isQuickLoginLoading,
        handleQuickLogin,
    } = useQuickLogin();

    // Theo dõi giá trị email hiện tại (Real-time)
    const emailValue = watch("email");

    const INPUT_CLASSES = cn(
        "bg-threads-dropdown-hover text-threads-text placeholder:text-threads-dim",
        "md:focus:border-threads-border font-helvetica h-13.5 rounded-[12px]",
        "border border-transparent text-[15px] focus-visible:ring-0 md:text-[15px]",
        "transition-colors duration-200",
    );

    return (
        <div className="flex w-full flex-col items-center px-4 min-[520px]:px-0">
            {/* Title */}
            <div className="mb-4 text-center">
                <span className="text-threads-text text-[16px] font-bold">
                    {t("auth:login_title")}
                </span>
            </div>

            {/* Banner Thông Báo Xác Minh Email Thành Công */}
            {verifySuccessMessage && (
                <div className="mb-4 w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                    <p className="text-[14px] font-medium leading-tight text-emerald-500">
                        {verifySuccessMessage}
                    </p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
                {/* Email Input */}
                <div className="mb-2">
                    <Input
                        id="email"
                        autoComplete="off"
                        placeholder={t("auth:email_label")}
                        className={cn(
                            INPUT_CLASSES,
                            errors.email &&
                                "border-red-500! focus:border-red-500!",
                        )}
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Input */}
                <div className="mb-2">
                    <Input
                        id="password"
                        autoComplete="off"
                        type="password"
                        placeholder={t("auth:password_label")}
                        className={cn(
                            INPUT_CLASSES,
                            errors.password &&
                                "border-red-500! focus:border-red-500!",
                        )}
                        {...register("password")}
                    />
                    {errors.password && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Login Button */}
                <Button
                    type="submit"
                    className={cn(
                        "h-13.5 w-full cursor-pointer rounded-xl text-[15px] font-semibold transition-all",
                        "bg-threads-button-bg text-threads-button-text",
                        "hover:bg-threads-button-bg active:scale-95",
                        "disabled:pointer-events-auto disabled:opacity-100",
                        (!isValid || isLoading) &&
                            "hover:bg-threads-button-bg cursor-not-allowed active:scale-100",
                    )}
                    disabled={!isValid || isLoading}
                >
                    {isLoading ? (
                        <LoadingIcon className="h-4.5 w-4.5 animate-[spin_1s_steps(8,end)_infinite]" />
                    ) : (
                        <span className={cn(!isValid && "opacity-40")}>
                            {t("auth:login_btn")}
                        </span>
                    )}
                </Button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4">
                <Link
                    to={paths.forgot_password}
                    state={{ email: emailValue }}
                    className="text-threads-dim text-[15px] hover:underline"
                >
                    {t("auth:forgot_password")}
                </Link>
            </div>

            {lastUser && (
                <>
                    {/* Divider OR */}
                    <div className="my-0 flex h-16 w-full items-center justify-center">
                        <div className="bg-threads-border h-px w-full max-w-6.75"></div>
                        <span className="text-threads-dim px-4 text-[15px] font-normal">
                            {t("auth:or")}
                        </span>
                        <div className="bg-threads-border h-px w-full max-w-6.75"></div>
                    </div>

                    {/* Instagram Button */}
                    <div className="w-full">
                        <InstagramLoginButton
                            onClick={handleQuickLogin}
                            userInfo={lastUser}
                            isLoading={isQuickLoginLoading}
                        />
                    </div>
                </>
            )}

            {/* Link Đăng ký */}
            <div className="text-threads-dim mt-6 text-[15px]">
                {t("auth:no_account")}{" "}
                <Link
                    to={paths.register}
                    className="text-threads-text font-medium hover:underline"
                >
                    {t("auth:register")}
                </Link>
            </div>
        </div>
    );
}

export default LoginForm;
