import { VerifyIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { formatTime } from "@/utils/dateFormatter";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router";

function QuotePostHeader({ user, createdAt, className, onStopPropagation }) {
    return (
        <div
            className={cn("mb-px flex w-full flex-row items-center", className)}
        >
            {/* Avatar  */}
            <div className="pe-2">
                <div className="relative h-5.5 w-5.5 rounded-[18px]">
                    <Link
                        to={`/@${user.username}`}
                        onClick={onStopPropagation}
                        className="display-inline cursor-pointer border-none"
                    >
                        <div className="flex h-5.5 w-5.5 rounded-full">
                            <img
                                src={
                                    user.avatar_url ||
                                    "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg"
                                }
                                alt={user.username}
                                className="outline-threads-border rounded-full object-cover outline-[0.5px] -outline-offset-[0.5px] outline-solid"
                            />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Info  */}
            <div className="flex w-[calc(100%-56px)] items-baseline gap-1.5 leading-5.25">
                <span className="flex flex-row items-center">
                    <Link
                        to={`/@${user.username}`}
                        onClick={onStopPropagation}
                        className="hover:underline"
                    >
                        <span className="text-threads-text relative block max-w-full truncate overflow-visible text-[15px] font-semibold wrap-break-word whitespace-pre-line">
                            {user.username}
                        </span>
                    </Link>
                    {user.verified && (
                        <VerifyIcon className="relative top-[0.5px] ms-1 h-3 w-3 text-blue-500" />
                    )}
                </span>

                {/* Time  */}
                <div className="flex shrink-0 grow-0">
                    <Link
                        to={`/@${user.username}/post/quoted`}
                        onClick={onStopPropagation}
                        className="text-threads-dim inline-block min-w-6 cursor-pointer text-center text-[15px] font-normal whitespace-nowrap"
                    >
                        <time>
                            <span>{formatTime(createdAt)}</span>
                        </time>
                    </Link>
                </div>
            </div>

            {/* Trống */}
            <div className="ms-auto flex items-center"></div>
        </div>
    );
}

QuotePostHeader.propTypes = {
    user: PropTypes.object.isRequired,
    createdAt: PropTypes.string.isRequired,
    className: PropTypes.string,
    onStopPropagation: PropTypes.func.isRequired,
};

export default QuotePostHeader;
