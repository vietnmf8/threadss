import { MorePostIcon, VerifyIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/dateFormatter";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router";

function StandardPostHeader({ user, createdAt, className, onStopPropagation }) {
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
                        to={`/@${user.username}`}
                        className="text-threads-text decoration-threads-text text-[15px] leading-5.25 font-semibold hover:underline"
                    >
                        {user.username}
                    </Link>

                    {user.verified && (
                        <VerifyIcon className="h-3 w-3 text-blue-500" />
                    )}
                </div>

                <span className="text-threads-dim text-[15px] leading-5.25 font-normal">
                    {formatTime(createdAt)}
                </span>
            </div>

            {/* More Options */}
            <div className="flex items-center gap-3">
                <div
                    role="button"
                    onClick={onStopPropagation}
                    className="group text-threads-dim relative flex cursor-pointer items-center justify-center"
                >
                    <div className="bg-threads-dropdown-hover absolute top-1/2 left-1/2 -z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
                    <MorePostIcon className="relative z-10 h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

StandardPostHeader.propTypes = {
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    className: PropTypes.string,
    onStopPropagation: PropTypes.func.isRequired,
};

export default StandardPostHeader;
