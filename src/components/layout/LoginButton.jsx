import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import paths from "@/configs/path";

function LoginButton({ className }) {
    const { t } = useTranslation(["auth"]);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Nếu đã đăng nhập thì thôi!
    if (isAuthenticated) return null;

    return (
        <Link to={paths.login} className={cn("inline-block", className)}>
            <Button
                variant="default"
                className={cn(
                    "h-8.5 rounded-lg px-4",
                    "text-threads-base leading-5.25 font-semibold",
                    "bg-threads-text text-threads-content-bg",
                    "hover:bg-threads-text transition-opacity hover:opacity-90",
                    "border-none shadow-none",
                )}
            >
                {t("auth:login_btn")}
            </Button>
        </Link>
    );
}

LoginButton.propTypes = {
    className: PropTypes.string,
};

export default LoginButton;
