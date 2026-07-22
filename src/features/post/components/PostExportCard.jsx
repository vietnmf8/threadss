import React from "react";
import PropTypes from "prop-types";
import { formatTime } from "@/utils/dateFormatter";
import { LogoIcon, VerifyIcon } from "@/assets/icons";

const FALLBACK_AVATAR =
    "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

/**
 * Component thẻ bài viết sạch phục vụ xuất ảnh (html-to-image)
 * Render ẩn khỏi màn hình chính với thiết kế chuẩn Threads
 */
function PostExportCard({ post, cardRef }) {
    if (!post) return null;

    const user = post.user || {};
    const avatarUrl = user.avatar_url || user.avatar || FALLBACK_AVATAR;
    const createdAt = post.created_at || post.createdAt;
    const media = post.media_urls || post.media || post.images || [];

    const handleImageError = (e) => {
        e.target.src = FALLBACK_AVATAR;
    };

    return (
        <div
            className="fixed -left-[9999px] top-0 pointer-events-none z-[-9999]"
            aria-hidden="true"
        >
            <div
                ref={cardRef}
                className="w-[540px] bg-threads-bg text-threads-text p-6 rounded-3xl border border-threads-border shadow-2xl font-sans"
            >
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                    <img
                        src={avatarUrl}
                        alt={user.username || "user"}
                        onError={handleImageError}
                        crossOrigin="anonymous"
                        className="w-11 h-11 rounded-full object-cover border border-threads-border"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-base leading-tight">
                                {user.name || user.username}
                            </span>
                            {user.verified && (
                                <VerifyIcon className="w-3.5 h-3.5 text-blue-500" />
                            )}
                        </div>
                        <span className="text-threads-dim text-sm">
                            @{user.username || "user"} • {createdAt ? formatTime(createdAt) : ""}
                        </span>
                    </div>
                </div>

                {/* Content Text */}
                {post.content && (
                    <p className="text-base leading-relaxed whitespace-pre-line mb-4 break-words">
                        {post.content}
                    </p>
                )}

                {/* Media Images */}
                {media.length > 0 && (
                    <div className="mb-4 overflow-hidden rounded-2xl border border-threads-border">
                        <img
                            src={typeof media[0] === "string" ? media[0] : media[0]?.url}
                            alt="Post media"
                            onError={handleImageError}
                            crossOrigin="anonymous"
                            className="w-full max-h-[400px] object-cover"
                        />
                    </div>
                )}

                {/* Threads Watermark Footer */}
                <div className="pt-4 border-t border-threads-border/50 flex items-center justify-between text-threads-dim text-xs">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="w-5 h-5 text-threads-text" />
                        <span className="font-semibold text-threads-text">Threads</span>
                    </div>
                    <span>threads.net</span>
                </div>
            </div>
        </div>
    );
}

PostExportCard.propTypes = {
    post: PropTypes.object,
    cardRef: PropTypes.object,
};

export default PostExportCard;
