import React from "react";
import PropTypes from "prop-types";
import QuotePostHeader from "./QuotePostHeader";
import StandardPostHeader from "./StandardPostHeader";

function PostHeader({ isQuote = false, ...props }) {
    /* Ngăn chặn event click lan ra card */
    const handleStopPropagation = (e) => {
        e.stopPropagation();
    };

    /* Quote */
    if (isQuote) {
        return (
            <QuotePostHeader
                {...props}
                onStopPropagation={handleStopPropagation}
            />
        );
    }

    /* Post */
    return (
        <StandardPostHeader
            {...props}
            onStopPropagation={handleStopPropagation}
        />
    );
}

PostHeader.propTypes = {
    isQuote: PropTypes.bool,
};

export default PostHeader;
