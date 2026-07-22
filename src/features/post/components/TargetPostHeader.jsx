import React from "react";
import PropTypes from "prop-types";
import { formatTime } from "@/utils/dateFormatter";
import { formatSnakeCaseText } from "@/utils/textFormatter";
import { VerifyIcon } from "@/assets/icons";

/**
 * Component hiển thị thông tin bài viết gốc (Target Post) ở đầu Reply Modal
 * kèm theo cột avatar và đường line liên kết với reply composer.
 */
function TargetPostHeader({ post }) {
    if (!post) return null;

    const user = post.user || {};
    const avatarUrl =
        user.avatar ||
        user.avatar_url ||
        "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

    return (
        <div className="flex grow items-start gap-3">
            {/* Cột trái: Avatar tác giả + đường thread line nối xuống */}
            <div className="flex flex-col items-center self-stretch pt-1">
                <div className="bg-threads-bg h-9 w-9 overflow-hidden rounded-full shrink-0">
                    <img
                        src={avatarUrl}
                        alt={user.username || "Avatar"}
                        className="h-full w-full object-cover"
                    />
                </div>
                {/* Đường nối kẻ dọc từ bài viết gốc xuống reply */}
                <div className="relative mt-2 flex min-h-6 grow flex-col items-center">
                    <div className="bg-threads-border absolute h-full w-0.5 rounded-full" />
                </div>
            </div>

            {/* Cột phải: Thông tin & Nội dung bài viết gốc */}
            <div className="flex grow flex-col pb-3">
                {/* Header: Username, Topic & Thời gian */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-threads-text text-[15px] font-semibold leading-5">
                        {user.username}
                    </span>
                    {user.verified && (
                        <VerifyIcon className="h-3 w-3 text-blue-500" />
                    )}
                    {(() => {
                        const rawTopic = post.topic_name || post.topic || post.category_name || post.category;
                        const topicName = typeof rawTopic === "object" ? rawTopic?.name : rawTopic;
                        return topicName ? (
                            <span className="text-threads-dim text-[14px]">
                                &gt; {formatSnakeCaseText(topicName)}
                            </span>
                        ) : null;
                    })()}
                    <span className="text-threads-dim text-[14px] leading-5 font-normal">
                        {formatTime(post.created_at)}
                    </span>
                </div>

                {/* Content bài viết gốc */}
                {post.content && (
                    <p className="text-threads-text mt-1 text-[15px] leading-relaxed whitespace-pre-line break-words">
                        {post.content}
                    </p>
                )}

                {/* Media bài viết gốc (nếu có) */}
                {Array.isArray(post.media) && post.media.length > 0 && (
                    <div className="mt-2.5 overflow-hidden rounded-xl border border-threads-border max-h-60">
                        {post.media.map((item, idx) => (
                            <img
                                key={item.id || idx}
                                src={item.url || item.path || item}
                                alt="Media preview"
                                className="w-full h-auto max-h-60 object-cover"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

TargetPostHeader.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        content: PropTypes.string,
        created_at: PropTypes.string,
        topic_name: PropTypes.string,
        user: PropTypes.object,
        media: PropTypes.array,
    }),
};

export default TargetPostHeader;
