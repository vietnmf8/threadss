import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { LoadingIcon } from "@/assets/icons";
import { useTranslation } from "react-i18next";
import paths from "@/configs/path";
import { Eye, EyeOff } from "lucide-react";

function RegisterForm({
    register,
    handleSubmit,
    errors,
    watch,
    isValid,
    isLoading,
    isCheckingEmail,
    isCheckingUsername,
}) {
    const { t } = useTranslation(["auth", "common"]);

    /* Toggle Password */
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /* Theo dõi thay đổi */
    const passwordValue = watch("password");
    const confirmPasswordValue = watch("confirmPassword");

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
                    {t("auth:register_title")}
                </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
                {/* Username */}
                <div className="mb-2">
                    <div className="relative">
                        <Input
                            id="username"
                            placeholder={t("auth:username_label")}
                            className={cn(
                                INPUT_CLASSES,
                                errors.username &&
                                    "border-red-500! focus:border-red-500!",
                            )}
                            {...register("username")}
                        />
                        {isCheckingUsername && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <LoadingIcon className="text-threads-dim h-4 w-4 animate-spin" />
                            </div>
                        )}
                    </div>
                    {errors.username && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-2">
                    <div className="relative">
                        <Input
                            id="email"
                            placeholder={t("auth:register_email_label")}
                            className={cn(
                                INPUT_CLASSES,
                                errors.email &&
                                    "border-red-500! focus:border-red-500!",
                            )}
                            {...register("email")}
                        />
                        {isCheckingEmail && (
                            <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                <LoadingIcon className="text-threads-dim h-4 w-4 animate-spin" />
                            </div>
                        )}
                    </div>
                    {errors.email && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-2">
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth:password_label")}
                            className={cn(
                                INPUT_CLASSES,
                                "pr-10",
                                errors.password &&
                                    "border-red-500! focus:border-red-500!",
                            )}
                            {...register("password")}
                        />

                        {passwordValue && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-threads-dim hover:text-threads-text absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>
                    {errors.password && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-2">
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("auth:confirm_password_label")}
                            className={cn(
                                INPUT_CLASSES,
                                "pr-10",
                                errors.confirmPassword &&
                                    "border-red-500! focus:border-red-500!",
                            )}
                            {...register("confirmPassword")}
                        />

                        {confirmPasswordValue && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="text-threads-dim hover:text-threads-text absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        )}
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 pl-2 text-xs text-red-500">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
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
                            {t("auth:register_btn")}
                        </span>
                    )}
                </Button>
            </form>

            {/* Link Login */}
            <div className="text-threads-dim mt-6 text-[15px]">
                {t("auth:have_account")}{" "}
                <Link
                    to={paths.login}
                    className="text-threads-text font-medium hover:underline"
                >
                    {t("auth:login_now")}
                </Link>
            </div>
        </div>
    );
}

RegisterForm.propTypes = {
    register: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
    isValid: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isCheckingEmail: PropTypes.bool.isRequired,
    isCheckingUsername: PropTypes.bool.isRequired,
};

export default RegisterForm;
