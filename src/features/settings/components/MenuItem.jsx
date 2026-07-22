import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/**
 * MenuItem: Component hiển thị từng dòng trong Menu
 */
const MenuItem = ({
    label,
    icon: Icon,
    rightIcon: RightIcon,
    onClick,
    variant = "default",
    className,
}) => {
    const isDestructive = variant === "destructive";

    return (
        <DropdownMenuItem
            onClick={onClick}
            className={cn(
                "w-full cursor-pointer rounded-xl px-3 py-3.5",
                "text-[15px] font-semibold",
                "focus:bg-threads-dropdown-hover focus:outline-none",
                isDestructive
                    ? "text-threads-destructive focus:text-threads-destructive"
                    : "text-threads-text",
                className,
            )}
        >
            <div className="flex w-full items-center justify-between">
                <span className="leading-5">{label}</span>
                {RightIcon && (
                    <RightIcon className="text-threads-icon-out h-4 w-4" />
                )}
                {Icon && (
                    <Icon className="text-threads-text size-5 transition-transform group-active:scale-95" />
                )}
            </div>
        </DropdownMenuItem>
    );
};

MenuItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
    rightIcon: PropTypes.elementType,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(["default", "destructive"]),
    className: PropTypes.string,
};

export default MenuItem;
