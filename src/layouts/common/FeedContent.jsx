import React from "react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

function FeedContent({ children }) {
    return (
        <div
            className={cn(
                "flex flex-1 shrink-0 flex-col",
                "mx-auto w-full md:max-w-full",
                "min-h-0 overflow-hidden",
                "bg-threads-content-bg z-0",
                "pt-0 md:pt-2",
                "border-threads-border-width border-threads-border md:border-x",
                "shadow-threads-feed",
            )}
        >
            {children}
        </div>
    );
}

FeedContent.propTypes = {
    children: PropTypes.node,
};

export default FeedContent;
