import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useSmartNavigate } from "@/hooks/useSmartNavigate";

const HeaderTabItem = ({
    tab,
    isActive,
    t,
    onRefetch,
    isFetching,
    className,
}) => {
    const { handleSmartClick } = useSmartNavigate();

    const handleClick = (e) => {
        handleSmartClick(e, tab.path, { onRefetch, isFetching });
    };

    return (
        <div className="flex shrink grow basis-0">
            <div className="relative grow px-4 text-center">
                <Link
                    to={tab.path}
                    onClick={handleClick}
                    className={cn(
                        "flex h-15 w-full flex-col items-center justify-center px-2 transition-opacity hover:no-underline",
                        isActive
                            ? "cursor-default"
                            : "cursor-pointer active:opacity-60",
                        className,
                    )}
                >
                    <div className="flex w-full flex-row items-center justify-center overflow-hidden">
                        <span
                            className={cn(
                                "text-[15px] leading-5.25 font-medium whitespace-nowrap",
                                isActive
                                    ? "text-threads-text"
                                    : "text-threads-dim",
                            )}
                        >
                            {t(`home:${tab.labelKey}`)}
                        </span>
                    </div>

                    {/* Active Border */}
                    {isActive && (
                        <div className="border-threads-text absolute top-[48.5px] left-0 z-1 h-0 w-full border-b md:top-14.75" />
                    )}
                </Link>
            </div>
        </div>
    );
};

HeaderTabItem.propTypes = {
    tab: PropTypes.shape({
        id: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
        labelKey: PropTypes.string.isRequired,
    }).isRequired,
    isActive: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    onRefetch: PropTypes.func,
    isFetching: PropTypes.bool,
    className: PropTypes.string,
};

export default HeaderTabItem;
