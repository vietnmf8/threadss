import React from "react";
import PropTypes from "prop-types";
import { formatTime } from "@/utils/dateFormatter";
import { LogoIcon, VerifyIcon, LikeIcon, LikedIcon, ReplyIcon, RepostIcon, RepostedIcon } from "@/assets/icons";

const FALLBACK_AVATAR =
    "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

/**
 * Component EmbedPostCard hiển thị bài viết được thiết kế chuyên biệt cho Embed Iframe.
 * Cho phép xem nội dung bài viết và mở tab mới về bài viết gốc khi tương tác.
 */
function EmbedPostCard({ post }) {
    if (!post) return null;

    const user = post.user || {};
    const avatarUrl = user.avatar_url || user.avatar || FALLBACK_AVATAR;
    const createdAt = post.created_at || post.createdAt;
    const media = post.media_urls || post.media || post.images || [];

    const rawUsername = user.username || "user";
    const username = rawUsername.replace(/^@/, "");
    const targetUrl = `/${username}/post/${post.id}`;

    const handleOpenPost = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    };

    const handleImageError = (e) => {
        e.target.src = FALLBACK_AVATAR;
    };

    const LikeIconComponent = post.is_liked_by_auth ? LikedIcon : LikeIcon;
    const RepostIconComponent = post.is_reposted_by_auth ? RepostedIcon : RepostIcon;

    return (
        <div
            onClick={handleOpenPost}
            className="w-full bg-threads-bg border border-threads-border rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm hover:border-threads-border/80 transition-all cursor-pointer select-none group"
        >
            <div className="flex flex-col gap-3">
                {/* Header: Avatar, Name, Username, Time */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={avatarUrl}
                            alt={username}
                            onError={handleImageError}
                            className="w-10 h-10 rounded-full object-cover border border-threads-border shrink-0"
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="font-semibold text-[15px] leading-tight text-threads-text group-hover:underline">
                                    {user.name || username}
                                </span>
                                {user.verified && (
                                    <VerifyIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                            </div>
                            <span className="text-threads-dim text-xs">
                                @{username}
                            </span>
                        </div>
                    </div>
                    {createdAt && (
                        <span className="text-threads-dim text-xs shrink-0 pt-0.5">
                            {formatTime(createdAt)}
                        </span>
                    )}
                </div>

                {/* Content Text */}
                {post.content && (
                    <p className="text-[14px] sm:text-[15px] text-threads-text leading-relaxed whitespace-pre-line break-words">
                        {post.content}
                    </p>
                )}

                {/* Media Image / Gallery */}
                {media.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-threads-border max-h-[280px] bg-threads-hover/30">
                        <img
                            src={typeof media[0] === "string" ? media[0] : media[0]?.url}
                            alt="Post media content"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Interaction Counters Bar */}
                <div className="flex items-center gap-5 pt-1 text-threads-dim text-xs">
                    <div className="flex items-center gap-1.5 hover:text-threads-text transition-colors">
                        <LikeIconComponent className={`w-4 h-4 ${post.is_liked_by_auth ? "text-red-500" : ""}`} />
                        <span>{post.likes_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-threads-text transition-colors">
                        <ReplyIcon className="w-4 h-4" />
                        <span>{post.replies_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-threads-text transition-colors">
                        <RepostIconComponent className={`w-4 h-4 ${post.is_reposted_by_auth ? "text-green-500" : ""}`} />
                        <span>{post.reposts_and_quotes_count || post.reposts_count || 0}</span>
                    </div>
                </div>
            </div>

            {/* Watermark Footer */}
            <div className="pt-3 mt-4 border-t border-threads-border/60 flex items-center justify-between text-threads-dim text-xs">
                <div className="flex items-center gap-2">
                    <LogoIcon className="w-4 h-4 text-threads-text" />
                    <span className="font-semibold text-threads-text text-xs">Threads</span>
                </div>
                <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOpenPost}
                    className="font-medium text-xs text-threads-dim hover:text-threads-text group-hover:underline flex items-center gap-1"
                >
                    <span>Xem trên Threads</span>
                    <span className="text-xs">↗</span>
                </a>
            </div>
        </div>
    );
}

EmbedPostCard.propTypes = {
    post: PropTypes.object,
};

export default EmbedPostCard;
