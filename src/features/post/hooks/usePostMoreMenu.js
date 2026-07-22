import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

/**
 * Custom hook xử lý logic cho Menu 3 chấm (Post More Options)
 */
export const usePostMoreMenu = (post) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: "",
        description: "",
        confirmText: "Xác nhận",
        isDanger: true,
        onConfirm: () => {},
    });

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
        toast.success("Đã sao chép liên kết bài viết");
    }, [post]);

    /* 2. Xử lý Save / Unsave */
    const handleToggleSave = useCallback(() => {
        setIsSaved((prev) => {
            const next = !prev;
            toast.success(next ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết");
            return next;
        });
    }, []);

    /* 3. Xử lý Not Interested */
    const handleNotInterested = useCallback(() => {
        toast.success("Đã ẩn bài viết tương tự khỏi bảng tin của bạn");
    }, []);

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

    /* 7. Xử lý Delete Post (Xác nhận - Dành cho chính chủ) */
    const handleOpenDeleteConfirm = useCallback(() => {
        setConfirmState({
            open: true,
            title: "Xóa bài viết?",
            description: "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
            confirmText: "Xóa",
            isDanger: true,
            onConfirm: () => {
                toast.success("Đã xóa bài viết");
            },
        });
    }, []);

    /* 8. Xử lý Edit Post */
    const handleEditPost = useCallback(() => {
        toast.info("Chức năng chỉnh sửa bài viết đang được phát triển");
    }, []);

    /* 9. Xử lý Report Post */
    const handleOpenReport = useCallback(() => {
        setReportModalOpen(true);
    }, []);

    return {
        isOwner,
        isMenuOpen,
        setIsMenuOpen,
        isSaved,
        reportModalOpen,
        setReportModalOpen,
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
