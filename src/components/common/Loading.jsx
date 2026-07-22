import { LoadingIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import React from "react";

const Loading = ({ className }) => {
    return (
        <div className={cn("flex justify-center", className)}>
            <LoadingIcon className="text-threads-text h-4.5 w-4.5 animate-[spin_1s_steps(8,end)_infinite]" />
        </div>
    );
};

Loading.propTypes = {
    className: PropTypes.string,
};

export default Loading;
