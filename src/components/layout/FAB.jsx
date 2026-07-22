import React from "react";
import { cn } from "@/lib/utils";
import { CreateIcon } from "@/assets/icons";

function FAQ() {
    return (
        <div
            className={cn(
                "fixed right-6 bottom-6 z-50 hidden items-center justify-center md:flex",
                "h-17 w-20.5",
                "bg-threads-content-bg shadow-threads-floating border-threads-border-width border-threads-border rounded-2xl border",
                "ease-spring cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95",
            )}
        >
            <CreateIcon className="text-threads-text h-7 w-7" />
        </div>
    );
}

export default FAQ;
