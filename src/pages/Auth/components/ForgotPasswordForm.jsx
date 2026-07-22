import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import paths from "@/configs/path";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LoadingIcon } from "@/assets/icons";
import { Lock } from "lucide-react";
import PropTypes from "prop-types";

function ForgotPasswordForm({
    register,
    handleSubmit,
    errors,
    isValid,
    isLoading,
}) {
    const { t } = useTranslation(["auth"]);

    const INPUT_CLASSES = cn(
        "bg-threads-dropdown-hover text-threads-text placeholder:text-threads-dim",
        "md:focus:border-threads-border font-helvetica h-13.5 rounded-[12px]",
        "border border-transparent text-[15px] focus-visible:ring-0 md:text-[15px]",
        "transition-colors duration-200",
    );

    return (
        <div className="flex w-full flex-col items-center px-4 min-[520px]:px-0">
            {/* Icon Lock */}
            <div className="mb-4 flex items-center justify-center rounded-full border-2 border-black p-4 dark:border-white">
                <Lock className="h-10 w-10 stroke-[1.5]" />
            </div>

            {/* Title */}
            <div className="mb-2 text-center">
                <span className="text-threads-text text-[16px] font-bold">
                    {t("auth:forgot_password_title")}
                </span>
            </div>

            {/* Description */}
            <div className="text-threads-dim mb-6 text-center text-[15px] md:max-w-105 md:text-balance">
                <span>{t("auth:forgot_password_desc")}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                {/* Email Input */}
                <div>
                    <Input
                        id="email"
                        autoComplete="email"
                        placeholder={t("auth:register_email_label")}
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
                            {t("auth:send_login_link")}
                        </span>
                    )}
                </Button>
            </form>

            {/* Divider OR */}
            <div className="my-0 flex h-16 w-full items-center justify-center">
                <div className="bg-threads-border h-px w-full max-w-6.75"></div>
                <span className="text-threads-dim px-4 text-[15px] font-normal">
                    {t("auth:or")}
                </span>
                <div className="bg-threads-border h-px w-full max-w-6.75"></div>
            </div>

            {/* Back to Login */}
            <div className="text-threads-text text-[15px] font-medium hover:underline">
                <Link to={paths.login}>{t("auth:back_to_login")}</Link>
            </div>
        </div>
    );
}

ForgotPasswordForm.propTypes = {
    register: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isValid: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default ForgotPasswordForm;
