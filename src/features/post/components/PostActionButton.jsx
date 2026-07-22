/* eslint-disable no-unused-vars */
// Đường dẫn: src/components/post/PostActionButton.jsx
import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Counter from "./Counter";

/**
 * Component hiển thị giao diện cho từng nút bấm.
 */
const PostActionButton = forwardRef(
    (
        {
            id,
            Icon,
            count,
            active,
            activeClass,
            onClick,
            className,
            isDropdown,
            ...props
        },
        ref,
    ) => {
        /* Ẩn số 1 khi đang active */
        const displayCount = count === 1 && active ? null : count;

        return (
            <div
                ref={ref}
                {...props}
                role="button"
                onClick={onClick}
                className={cn(
                    "group relative z-10 flex h-9 w-auto cursor-pointer items-center gap-1.5 rounded-full select-none",
                    "transition-transform duration-200 active:scale-90",
                    "px-3",
                    className,
                )}
            >
                {/* Lớp nền khi hover */}
                <div className="group-hover:bg-threads-hover absolute inset-0 -z-10 scale-75 rounded-full bg-transparent opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />

                {/* Icon hành động */}
                <Icon
                    className={cn(
                        "stroke-[2px] transition-colors",
                        id === "like" ? "h-5 w-5" : "h-4.5 w-4.5",
                        active
                            ? activeClass
                            : "text-threads-icon-action group-hover:text-threads-icon-action",
                    )}
                />

                {/* Số lượng tương tác */}
                {displayCount > 0 && (
                    <Counter
                        count={displayCount}
                        className={cn(
                            "text-[13px] leading-4.5 font-normal transition-colors",
                            active
                                ? activeClass
                                : "text-threads-icon-action group-hover:text-threads-icon-action",
                        )}
                    />
                )}
            </div>
        );
    },
);

PostActionButton.displayName = "PostActionButton";

PostActionButton.propTypes = {
    id: PropTypes.string.isRequired,
    Icon: PropTypes.elementType.isRequired,
    count: PropTypes.number,
    active: PropTypes.bool,
    activeClass: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    isDropdown: PropTypes.bool,
};

export default PostActionButton;
