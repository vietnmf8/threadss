import React from "react";
import { useParams } from "react-router";
import { useGetSinglePostQuery, useGetRepliesQuery } from "@/services/post";
import PostDetailHeader from "./components/PostDetailHeader";
import QuickReplyBar from "./components/QuickReplyBar";
import PostCard from "@/features/post/components/PostCard";
import { useTranslation } from "react-i18next";

/**
 * Trang Chi Tiết Bài Viết (Thread Detail Page)
 * Hiển thị bài viết gốc, thanh trả lời nhanh và toàn bộ bình luận (replies)
 */
function PostDetail() {
    const { postId } = useParams();
    const { t } = useTranslation(["home"]);

    /* RTK Query gọi API lấy chi tiết bài viết & danh sách bình luận */
    const {
        data: postResponse,
        isLoading: isPostLoading,
        isError: isPostError,
    } = useGetSinglePostQuery(postId, { skip: !postId });

    const {
        data: repliesResponse,
        isLoading: isRepliesLoading,
    } = useGetRepliesQuery({ id: postId }, { skip: !postId });

    const post = postResponse?.data || postResponse;
    const replies = repliesResponse?.data || (Array.isArray(repliesResponse) ? repliesResponse : []);

    if (isPostLoading) {
        return (
            <div className="flex h-60 w-full items-center justify-center">
                <div className="border-threads-text h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
        );
    }

    if (isPostError || !post) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-threads-dim text-[15px]">
                    Không tìm thấy bài viết hoặc bài viết đã bị xóa.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-threads-content-bg min-h-screen w-full pb-12">
            {/* Header top bar */}
            <PostDetailHeader title="Thread" />

            {/* Bài viết gốc */}
            <div className="w-full">
                <PostCard post={post} disableNavigation={true} />
            </div>

            {/* Thanh reply nhanh ở giữa */}
            <QuickReplyBar post={post} />

            {/* Thanh tiêu đề tùy chọn danh sách bình luận (Mới đây / Xem hoạt động) */}
            <div className="border-threads-border flex h-10 w-full items-center justify-between border-b px-6 text-[14px]">
                <div className="text-threads-text flex cursor-pointer items-center gap-1 font-semibold">
                    <span>↓↑ Mới đây</span>
                </div>
                <div className="text-threads-dim cursor-pointer font-normal hover:underline">
                    <span>Xem hoạt động &gt;</span>
                </div>
            </div>

            {/* Danh sách các câu trả lời / bình luận */}
            <div className="flex flex-col">
                {isRepliesLoading ? (
                    <div className="flex h-32 w-full items-center justify-center">
                        <div className="border-threads-text h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                ) : replies.length > 0 ? (
                    replies.map((replyPost, index) => {
                        const nextReply = replies[index + 1];
                        // Tự động nối thread line nếu comment này và comment tiếp theo thuộc cùng chuỗi tác giả hoặc có parent relation
                        const isSameAuthor = Boolean(
                            nextReply &&
                            replyPost.user?.username &&
                            nextReply.user?.username &&
                            replyPost.user.username === nextReply.user.username,
                        );

                        const isParentChild = Boolean(
                            nextReply && nextReply.parent_id === replyPost.id,
                        );

                        const hasThreadLine = isSameAuthor || isParentChild;

                        return (
                            <div key={replyPost.id || index}>
                                <PostCard
                                    post={replyPost}
                                    hasThreadLine={hasThreadLine}
                                    disableNavigation={true}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center">
                        <span className="text-threads-dim text-[14px]">
                            {t("home:no_replies_yet") ||
                                "Chưa có bình luận nào. Hãy là người đầu tiên trả lời!"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostDetail;
