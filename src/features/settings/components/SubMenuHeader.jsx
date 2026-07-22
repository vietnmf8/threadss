import React from "react";
import PropTypes from "prop-types";
import { PrevIcon } from "@/assets/icons";

/**
 * SubMenuHeader: Thanh tiêu đề có nút Back
 */
const SubMenuHeader = ({ title, onBack, rightAction }) => {
    return (
        <div className="border-threads-border flex items-center justify-between border-b p-4">
            {/* Prev & Title */}
            <div className="flex items-center gap-4">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        onBack();
                    }}
                    className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-black/5 active:scale-90 dark:hover:bg-white/10"
                >
                    <PrevIcon className="text-threads-text size-5" />
                </div>
                <span className="text-threads-text text-[17px] leading-6 font-bold">
                    {title}
                </span>
            </div>

            {/* Action */}
            {rightAction ? (
                <div className="flex cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-90">
                    {rightAction}
                </div>
            ) : (
                <div className="w-8" />
            )}
        </div>
    );
};

SubMenuHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    rightAction: PropTypes.node,
};

export default SubMenuHeader;
