import PropTypes from "prop-types";
import React from "react";
import { motion } from "framer-motion";

/* HighLight Email */
const EmailHighlight = ({ children }) => {
    return (
        <span className="relative inline-block px-2 font-semibold text-green-600">
            <span className="relative z-10">{children}</span>
            <motion.span
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="absolute bottom-0.5 left-0 z-0 h-5 w-full rounded-sm bg-green-50 dark:bg-green-900/30"
            />
        </span>
    );
};

EmailHighlight.propTypes = {
    children: PropTypes.node,
};

export default EmailHighlight;
