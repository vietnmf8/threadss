import { MoreIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

const TriggerButton = forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
            {...props}
            className="relative flex h-12 w-12 cursor-pointer items-center justify-center"
        >
            <div
                className={cn(
                    "bg-threads-content-bg border-threads-border-width border-threads-border flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-transform",
                    "hover:scale-110 active:scale-90",
                )}
            >
                <MoreIcon className="text-threads-text h-3 w-3" />
            </div>
        </div>
    );
});

TriggerButton.displayName = "TriggerButton";
export default TriggerButton;
