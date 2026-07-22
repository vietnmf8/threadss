import React from "react";
import { useParams, Link } from "react-router";
import { useGetSinglePostQuery } from "@/services/post";
import EmbedPostCard from "@/features/post/components/EmbedPostCard";
import { LogoIcon } from "@/assets/icons";

/**
 * Trang Embed Post (`/:username/post/:postId/embed` & `/@:username/post/:postId/embed`)
 * Hiển thị một bài viết đơn lẻ được nhúng trong thẻ iframe.
 */
function Embed() {
    const { postId } = useParams();

    /* Gọi API lấy chi tiết bài viết (Không cần Token xác thực) */
    const {
        data: postResponse,
        isLoading,
        isError,
    } = useGetSinglePostQuery(postId, { skip: !postId });

    const post = postResponse?.data || postResponse;

    /* 1. Trạng thái Loading */
    if (isLoading) {
        return (
            <div className="flex h-64 w-full items-center justify-center bg-threads-bg border border-threads-border rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                    <div className="border-threads-text h-7 w-7 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-threads-dim text-xs">Đang tải bài viết...</span>
                </div>
            </div>
        );
    }

    /* 2. Trạng thái Lỗi / Không tìm thấy bài viết */
    if (isError || !post || !post.id) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-threads-bg border border-threads-border rounded-2xl shadow-sm text-center gap-4">
                <LogoIcon className="w-8 h-8 text-threads-text" />
                <div className="flex flex-col gap-1">
                    <h3 className="text-threads-text font-semibold text-base">
                        Không tìm thấy bài viết
                    </h3>
                    <p className="text-threads-dim text-xs max-w-[280px]">
                        Bài viết này không tồn tại, đã bị xóa hoặc chế độ riêng tư không cho phép nhúng.
                    </p>
                </div>
                <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 px-4 py-2 bg-threads-text text-threads-bg rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                    Truy cập Threads
                </Link>
            </div>
        );
    }

    /* 3. Trạng thái Thành công */
    return <EmbedPostCard post={post} />;
}

export default Embed;
