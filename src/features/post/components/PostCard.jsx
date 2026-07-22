import React from "react";
import PropTypes from "prop-types";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import { useNavigate } from "react-router";
import { FollowIcon } from "@/assets/icons";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

function PostCard({
    post,
    isQuote = false,
    hasThreadLine = false,
    disableNavigation = false,
}) {
    const navigate = useNavigate();
    const FALLBACK_AVATAR =
        "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

    /* Lấy trạng thái đăng nhập từ Redux Store */
    const { isAuthenticated } = useSelector((state) => state.auth);

    /* Hành vi nhấn vào Card */
    const handleCardClick = () => {
        if (disableNavigation) return;
        if (post?.user?.username && post?.id) {
            navigate(`/@${post.user.username}/post/${post.id}`);
        }
    };

    /* Hành vi nhấn vào Avatar */
    const handleAvatarClick = (e) => {
        e.stopPropagation();
        if (post?.user?.username) {
            navigate(`/@${post.user.username}`);
        }
    };

    /* Xử lý nếu không có avatar */
    const handleImageError = (e) => {
        e.target.src = FALLBACK_AVATAR;
    };

    /* Xử lý click Follow */
    const handleFollowClick = (e) => {
        e.stopPropagation();
        console.log("Open Follow Dialog");
    };

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                "border-threads-border transition-colors",
                !disableNavigation && "cursor-pointer",
                !isQuote &&
                    "grid grid-cols-[48px_minmax(0,1fr)] px-6 pt-3 pb-2",
                !isQuote && !hasThreadLine && "border-b",
                isQuote && "flex flex-col",
            )}
        >
            {/* Avatar (Chỉ hiển thị nếu KHÔNG PHẢI Quote) */}
            {!isQuote && (
                <div className="col-start-1 row-span-2 flex flex-col items-center pt-1 self-stretch relative">
                    <div className="relative z-10" onClick={handleAvatarClick}>
                        <div className="border-threads-border h-9 w-9 overflow-hidden rounded-full border-[0.5px] bg-gray-200">
                            <img
                                src={post.user?.avatar_url || post.user?.avatar || FALLBACK_AVATAR}
                                alt={post.user?.username || "User"}
                                onError={handleImageError}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Chỉ hiển thị nút Follow nếu Đã đăng nhập & Chưa follow */}
                        {isAuthenticated && !post.user?.is_following && (
                            <div
                                onClick={handleFollowClick}
                                className="bg-threads-icon-fill border-threads-bg absolute -right-1 -bottom-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-transform active:scale-90"
                            >
                                <FollowIcon className="text-threads-content-bg h-2.5 w-2.5" />
                            </div>
                        )}
                    </div>

                    {/* Đường chỉ kẻ dọc nối avatar với comment kế tiếp trong chuỗi thread */}
                    {hasThreadLine && (
                        <div className="bg-threads-border absolute top-11 bottom-0 w-0.5 rounded-full left-4.25" />
                    )}
                </div>
            )}

            {/* CỘT 2: Content */}
            <div className={cn("flex flex-col", !isQuote && "col-start-2")}>
                <PostHeader
                    post={post}
                    user={post.user}
                    createdAt={post.created_at}
                    isQuote={isQuote}
                />

                <PostContent
                    content={post.content}
                    mediaUrls={post.media_urls}
                />

                {!isQuote && (
                    <PostActions
                        post={post}
                        id={post.id}
                        likesCount={post.likes_count}
                        repliesCount={post.replies_count}
                        repostsCount={post.reposts_and_quotes_count || 0}
                        isLiked={post.is_liked_by_auth}
                        isReposted={post.is_reposted_by_auth}
                    />
                )}
            </div>
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        created_at: PropTypes.string.isRequired,
        content: PropTypes.string,
        media_urls: PropTypes.array,
        likes_count: PropTypes.number,
        replies_count: PropTypes.number,
        reposts_and_quotes_count: PropTypes.number,
        is_liked_by_auth: PropTypes.bool,
        is_reposted_by_auth: PropTypes.bool,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            avatar_url: PropTypes.string,
            is_following: PropTypes.bool,
            verified: PropTypes.bool,
        }).isRequired,
    }).isRequired,
    isQuote: PropTypes.bool,
    hasThreadLine: PropTypes.bool,
    disableNavigation: PropTypes.bool,
};

export default PostCard;
