import { VerifyIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/dateFormatter";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router";
import PostMoreMenu from "./PostMoreMenu";

function StandardPostHeader({ user, createdAt, post, className, onStopPropagation }) {
    return (
        <div
            className={cn(
                "flex h-5.25 w-full items-start justify-between",
                className,
            )}
        >
            {/* Username & Verify & Time */}
            <div className="group flex h-full items-center gap-1.5">
                <div
                    className="flex items-center gap-1"
                    onClick={onStopPropagation}
                >
                    <Link
                        to={`/@${user?.username}`}
                        className="text-threads-text decoration-threads-text text-[15px] leading-5.25 font-semibold hover:underline"
                    >
                        {user?.username}
                    </Link>

                    {user?.verified && (
                        <VerifyIcon className="h-3 w-3 text-blue-500" />
                    )}
                </div>

                <span className="text-threads-dim text-[15px] leading-5.25 font-normal">
                    {formatTime(createdAt)}
                </span>
            </div>

            {/* More Options */}
            <div className="flex items-center gap-3" onClick={onStopPropagation}>
                <PostMoreMenu post={post || { user, created_at: createdAt }} />
            </div>
        </div>
    );
}

StandardPostHeader.propTypes = {
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    post: PropTypes.object,
    className: PropTypes.string,
    onStopPropagation: PropTypes.func.isRequired,
};

export default StandardPostHeader;

