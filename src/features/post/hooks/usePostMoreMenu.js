import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { useDeletePostMutation } from "@/services/post";

/**
 * Custom hook xử lý logic cho Menu 3 chấm (Post More Options)
 */
export const usePostMoreMenu = (post) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        description: "",
        confirmText: "Xác nhận",
        isDanger: true,
        onConfirm: () => {},
    });

    const [deletePost] = useDeletePostMutation();
    const isComment = Boolean(post?.parent_id);

    const isOwner = Boolean(
        currentUser &&
        post?.user &&
        (currentUser.id === post.user.id || currentUser.username === post.user.username)
    );

    /* 1. Xử lý Copy Link */
    const handleCopyLink = useCallback(() => {
        if (!post) return;
        const username = post.user?.username || "user";
        const url = `${window.location.origin}/@${username}/post/${post.id}`;
        copy(url);
        toast.success(isComment ? "Đã sao chép liên kết bình luận" : "Đã sao chép liên kết bài viết");
    }, [post, isComment]);

    /* 2. Xử lý Save / Unsave */
    const handleToggleSave = useCallback(() => {
        setIsSaved((prev) => {
            const next = !prev;
            toast.success(
                next
                    ? isComment
                        ? "Đã lưu bình luận"
                        : "Đã lưu bài viết"
                    : isComment
                      ? "Đã bỏ lưu bình luận"
                      : "Đã bỏ lưu bài viết"
            );
            return next;
        });
    }, [isComment]);

    /* 3. Xử lý Not Interested */
    const handleNotInterested = useCallback(() => {
        toast.success(isComment ? "Đã ẩn bình luận tương tự" : "Đã ẩn bài viết tương tự khỏi bảng tin của bạn");
    }, [isComment]);

    /* 4. Xử lý Mute User */
    const handleMuteUser = useCallback(() => {
        const username = post?.user?.username || "người dùng";
        toast.success(`Đã tắt tiếng @${username}`);
    }, [post]);

    /* 5. Xử lý Restrict User */
    const handleRestrictUser = useCallback(() => {
        const username = post?.user?.username || "người dùng";
        toast.success(`Đã hạn chế @${username}`);
    }, [post]);

    /* 6. Xử lý Block User (Xác nhận) */
    const handleOpenBlockConfirm = useCallback(() => {
        const username = post?.user?.username || "người dùng";
        setConfirmState({
            open: true,
            title: `Chặn @${username}?`,
            description: "Họ sẽ không thể xem nội dung hoặc tương tác với bạn trên Threads nữa.",
            confirmText: "Chặn",
            isDanger: true,
            onConfirm: () => {
                toast.success(`Đã chặn @${username}`);
            },
        });
    }, [post]);

    /* 7. Xử lý Delete Post / Comment (Xác nhận thực tế) */
    const handleOpenDeleteConfirm = useCallback(() => {
        const title = isComment ? "Xóa bình luận?" : "Xóa bài viết?";
        const description = isComment
            ? "Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
            : "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.";

        setConfirmState({
            open: true,
            title,
            description,
            confirmText: "Xóa",
            isDanger: true,
            onConfirm: async () => {
                if (!post?.id) return;
                try {
                    await deletePost(post.id).unwrap();
                    toast.success(isComment ? "Đã xóa bình luận" : "Đã xóa bài viết");
                } catch (error) {
                    console.error("Lỗi khi xóa:", error);
                    toast.error(error?.data?.message || (isComment ? "Xóa bình luận thất bại" : "Xóa bài viết thất bại"));
                }
            },
        });
    }, [post, isComment, deletePost]);

    /* 8. Xử lý Edit Post / Comment */
    const handleEditPost = useCallback(() => {
        setEditModalOpen(true);
    }, []);

    /* 9. Xử lý Report Post / Comment */
    const handleOpenReport = useCallback(() => {
        setReportModalOpen(true);
    }, []);

    return {
        isOwner,
        isComment,
        isMenuOpen,
        setIsMenuOpen,
        isSaved,
        reportModalOpen,
        setReportModalOpen,
        editModalOpen,
        setEditModalOpen,
        confirmState,
        setConfirmState,
        handleCopyLink,
        handleToggleSave,
        handleNotInterested,
        handleMuteUser,
        handleRestrictUser,
        handleOpenBlockConfirm,
        handleOpenDeleteConfirm,
        handleEditPost,
        handleOpenReport,
    };
};
