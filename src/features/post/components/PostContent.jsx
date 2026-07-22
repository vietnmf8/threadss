import React from "react";
import PropTypes from "prop-types";

function PostContent({ content, mediaUrls }) {
    return (
        <div className="mt-0.5">
            {/* Text Content */}
            {content && (
                <div className="text-threads-text text-[15px] leading-[140%] wrap-break-word whitespace-pre-line">
                    {content}
                </div>
            )}

            {/* Media Content (Ảnh/Video) */}
            {mediaUrls && mediaUrls.length > 0 && (
                <div className="border-threads-border mt-2 flex overflow-hidden rounded-lg border">
                    <img
                        src={mediaUrls[0]}
                        alt="Post media"
                        className="max-h-125 w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}
        </div>
    );
}

PostContent.propTypes = {
    content: PropTypes.string,
    mediaUrls: PropTypes.arrayOf(PropTypes.string),
};

export default PostContent;
