import { PinIcon } from "@/assets/icons";
import paths from "@/configs/path";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router";

function PinItem({ className }) {
    return (
        <div className="group relative flex h-15 w-full items-center justify-center">
            <div
                className={cn(
                    "ease-spring absolute h-12 w-full rounded-xl transition-all duration-300",
                    "bg-threads-nav-hover-bg",
                    "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                    "transition-transform duration-200 group-active:scale-90",
                )}
            ></div>

            <Link
                to={paths.home}
                className={cn(
                    "z-10 flex h-full w-full items-center justify-center",
                )}
            >
                <PinIcon
                    className={cn(
                        "transition-colors duration-200",
                        "text-threads-nav-icon-default",
                        className || "size-6.5",
                        "transition-transform duration-200 group-active:scale-90",
                    )}
                />
            </Link>
        </div>
    );
}

/* PropTypes */
PinItem.propTypes = {
    className: PropTypes.string,
};

export default PinItem;
