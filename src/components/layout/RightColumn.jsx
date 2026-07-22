import React from "react";
import { cn } from "@/lib/utils";
import { AddColumnIcon } from "@/assets/icons";

function RightColumn() {
    return (
        <div
            className={cn(
                "fixed top-0 right-0 bottom-0 z-30",
                "hidden h-screen flex-col md:flex",
                "pointer-events-none",
            )}
        >
            <div
                className="pointer-events-auto flex h-full items-center justify-start"
                style={{
                    paddingInlineEnd:
                        "calc((100vw - var(--threads-content-max-width)) / 2 - 24px)",
                    paddingInlineStart: "8px",
                }}
            >
                <div
                    className={cn(
                        "bg-threads-fixed-bar-bg absolute mt-9 flex h-9 w-9 items-center justify-center rounded-full",
                        "cursor-pointer transition-colors duration-300",
                        "text-threads-icon-out hover:text-black dark:hover:text-white",
                    )}
                >
                    <AddColumnIcon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default RightColumn;
