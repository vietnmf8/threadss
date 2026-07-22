import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useUpdatePostMutation } from "@/services/post";

/**
 * Dialog chỉnh sửa bài viết (Post) hoặc bình luận (Comment/Reply)
 */
function EditPostModal({ isOpen, onOpenChange, post }) {
    const { t } = useTranslation(["home"]);
    const isComment = Boolean(post?.parent_id);

    /* Form Local State */
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

    /* Pre-fill nội dung bài viết/bình luận cũ */
    useEffect(() => {
        if (post && isOpen) {
            setContent(post.content || "");
            const rawTopic = post.topic_name || post.topic;
            const topicStr = typeof rawTopic === "object" ? rawTopic?.name || "" : rawTopic || "";
            setTopic(topicStr);
        }
    }, [post, isOpen]);

    /* Xử lý Submit Cập Nhật */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!post?.id || !content.trim() || isUpdating) return;

        try {
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("content", content.trim());
            if (topic.trim()) {
                formData.append("topic_name", topic.trim());
                formData.append("topic", topic.trim());
            }

            await updatePost({
                id: post.id,
                body: formData,
            }).unwrap();

            const successMsg = isComment
                ? t("home:comment_updated_success") || "Đã cập nhật bình luận!"
                : t("home:post_updated_success") || "Đã cập nhật bài viết!";

            toast.success(successMsg);
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
            const failMsg = isComment
                ? t("home:comment_update_failed") || "Cập nhật bình luận thất bại"
                : t("home:post_update_failed") || "Cập nhật bài viết thất bại";
            toast.error(error?.data?.message || failMsg);
        }
    };

    if (!post) return null;

    const modalTitle = isComment
        ? t("home:edit_comment_title") || "Chỉnh sửa bình luận"
        : t("home:edit_post_title") || "Chỉnh sửa bài viết";

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={cn(
                    "bg-threads-content-bg shadow-threads-dialog border-threads-border border p-0",
                    "top-auto bottom-0 w-full max-w-full translate-y-0 rounded-t-2xl",
                    "md:top-1/2 md:bottom-auto md:left-1/2 md:w-140 md:max-w-[calc(100vw-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
                )}
            >
                {/* Title */}
                <DialogTitle className="sr-only">{modalTitle}</DialogTitle>
                <DialogDescription className="sr-only">
                    {modalTitle}
                </DialogDescription>

                {/* Header */}
                <div className="border-threads-border grid h-14 w-full grid-cols-[minmax(64px,140px)_minmax(0,1fr)_minmax(64px,140px)] items-center border-b px-6">
                    <div className="flex h-full items-center justify-start">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="text-threads-text cursor-pointer text-[17px] font-normal transition-transform active:scale-95"
                        >
                            {t("home:cancel")}
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-threads-text text-[16px] leading-[1.3125] font-bold">
                            {modalTitle}
                        </h1>
                    </div>

                    <div className="flex items-center justify-end" />
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-4">
                    {/* Username & Avatar info */}
                    <div className="flex items-center gap-3">
                        <img
                            src={
                                post.user?.avatar ||
                                post.user?.avatar_url ||
                                "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg"
                            }
                            alt={post.user?.username || "User"}
                            className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="text-threads-text font-semibold text-[15px]">
                            {post.user?.username}
                        </span>
                    </div>

                    {/* Textarea Content */}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                            isComment
                                ? t("home:edit_comment_placeholder") || "Nhập nội dung bình luận..."
                                : t("home:edit_post_placeholder") || "Nhập nội dung bài viết..."
                        }
                        className="text-threads-text placeholder:text-threads-dim w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none min-h-[120px]"
                    />

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-threads-border/50 pt-4">
                        <span className="text-threads-dim text-[13px]">
                            {content.length} / 500
                        </span>

                        <Button
                            type="submit"
                            disabled={!content.trim() || isUpdating}
                            className="h-9 rounded-[10px] border border-threads-border px-5 text-[15px] font-semibold text-threads-text bg-transparent hover:bg-transparent"
                        >
                            {isUpdating ? t("home:saving") || "Đang lưu..." : t("home:save") || "Lưu"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

EditPostModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    post: PropTypes.object,
};

export default EditPostModal;
