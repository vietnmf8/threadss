import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { SettingsIcon } from "@/assets/icons";

const SettingsButton = forwardRef(({ className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group flex items-center justify-center rounded-xl outline-none",
                "text-threads-nav-icon-default hover:text-threads-nav-icon-active",
                "data-[state=open]:text-threads-nav-icon-active",
                "ease-spring transition-all duration-300 hover:cursor-pointer active:scale-95",
                className,
            )}
            {...props}
        >
            <SettingsIcon className="h-6 w-6 transition-colors duration-200" />
        </button>
    );
});
SettingsButton.displayName = "SettingsButton";
SettingsButton.propTypes = {
    className: PropTypes.string,
};

export default SettingsButton;
