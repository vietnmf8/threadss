import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

/* Item trong Action Menu. */
function ActionMenuItem({ label, Icon, onClick, className, isDanger = false }) {
    return (
        <DropdownMenuItem
            className={cn(
                "focus:bg-threads-dropdown-hover w-56 cursor-pointer rounded-xl px-3 py-3.5 focus:outline-none",
                "flex items-center justify-between transition-colors select-none",
                isDanger
                    ? "text-threads-like focus:text-threads-like"
                    : "text-threads-text",
                className,
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
        >
            <span className="text-[15px] leading-3.5 font-semibold">
                {label}
            </span>
            {Icon && (
                <Icon
                    className={cn(
                        "size-5",
                        isDanger ? "text-threads-like" : "text-threads-text",
                    )}
                />
            )}
        </DropdownMenuItem>
    );
}

ActionMenuItem.propTypes = {
    label: PropTypes.string.isRequired,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
    className: PropTypes.string,
    isDanger: PropTypes.bool,
};

export default ActionMenuItem;
