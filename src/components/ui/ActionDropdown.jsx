import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

/* Dropdown Menu chung */
function ActionDropdown({
    open,
    onOpenChange,
    trigger,
    children,
    align = "end",
    sideOffset = -6,
    alignOffset = -6,
    className,
}) {
    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
            {trigger}
            <DropdownMenuContent
                align={align}
                sideOffset={sideOffset}
                alignOffset={alignOffset}
                avoidCollisions={true}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "bg-threads-content-bg border-threads-border shadow-threads-dropdown border-threads-border-width rounded-2xl border p-2",
                    className,
                )}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

ActionDropdown.propTypes = {
    open: PropTypes.bool,
    onOpenChange: PropTypes.func,
    trigger: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    align: PropTypes.string,
    sideOffset: PropTypes.number,
    alignOffset: PropTypes.number,
    className: PropTypes.string,
};

export default ActionDropdown;
