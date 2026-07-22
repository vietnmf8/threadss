import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuoteMoreIcon, ReplyOptionsIcon } from "@/assets/icons";
import { closeReplyDialog } from "../postSlice";
import CreatePostInput from "./CreatePostInput";
import TargetPostHeader from "./TargetPostHeader";
import { cn } from "@/lib/utils";
import { useThreadComposer } from "../hooks/useThreadComposer";
import AnimateHeight from "@/components/ui/animate-height";
import toast from "react-hot-toast";
import ConfirmCloseDialog from "./ConfirmCloseDialog";
import { useCreateReplyMutation } from "@/services/post";

/**
 * Component ReplyModal phục vụ việc phản hồi bài viết gốc.
 */
function ReplyModal() {
    const { t } = useTranslation(["home"]);
    const dispatch = useDispatch();

    /* Local state */
    const [showConfirm, setShowConfirm] = useState(false);
    const [replyPermission, setReplyPermission] = useState("everyone");
    const { isReplyDialogOpen, replyTargetPost } = useSelector(
        (state) => state.post,
    );
    const { user: authUser } = useSelector((state) => state.auth);

    /* RTK Query mutations */
    const [createReply, { isLoading: isSubmitting }] = useCreateReplyMutation();

    /* Quản lý Multi-thread */
    const {
        threads,
        topic,
        updateTopic,
        addThread,
        removeThread,
        updateThreadContent,
        resetThreads,
        canAddMore,
        canPost,
        isModified,
    } = useThreadComposer();

    /* Reset nội dung khi Dialog đóng */
    useEffect(() => {
        if (!isReplyDialogOpen) {
            resetThreads();
            setReplyPermission("everyone");
        }
    }, [isReplyDialogOpen, resetThreads]);

    /* Logic xử lý yêu cầu đóng (Hủy, ESC, click ngoài) */
    const handleCloseRequest = () => {
        if (isModified) {
            setShowConfirm(true);
        } else {
            handleFinalClose();
        }
    };

    /* Đóng hoàn toàn và reset dữ liệu */
    const handleFinalClose = () => {
        resetThreads();
        setReplyPermission("everyone");
        dispatch(closeReplyDialog());
        setShowConfirm(false);
    };

    /* Lấy avatar của user đăng nhập */
    const getAvatar = () => {
        if (authUser?.avatar || authUser?.avatar_url)
            return authUser.avatar || authUser.avatar_url;
        const stored = localStorage.getItem("lastLoggedInUser");
        if (stored)
            return (
                JSON.parse(stored)?.avatar_url ||
                "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg"
            );
        return "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";
    };
    const userAvatar = getAvatar();

    /* Target Username */
    const targetUsername = replyTargetPost?.user?.username || "";
    const customPlaceholder = targetUsername
        ? `${t("home:reply_to")} ${targetUsername}...`
        : t("home:reply_placeholder") || "Reply...";

    /* Xử lý gửi Reply */
    const handleSubmitReply = async () => {
        if (!canPost || !replyTargetPost?.id || isSubmitting) return;

        try {
            const targetId = replyTargetPost.id;

            for (let i = 0; i < threads.length; i++) {
                const currentThread = threads[i];
                if (currentThread.content.trim()) {
                    const formData = new FormData();
                    formData.append("content", currentThread.content);
                    formData.append("reply_permission", replyPermission);
                    if (topic.trim()) {
                        formData.append("topic_name", topic.trim());
                        formData.append("topic", topic.trim());
                    }

                    await createReply({
                        id: targetId,
                        body: formData,
                        topicName: topic.trim(),
                    }).unwrap();
                }
            }

            toast.success(t("home:reply_posted_success") || "Đã gửi câu trả lời thành công!");
            handleFinalClose();
        } catch (error) {
            console.error("Lỗi khi gửi reply:", error);
            toast.error(error?.data?.message || t("home:reply_failed") || "Gửi câu trả lời thất bại");
        }
    };

    /* Lấy nhãn hiển thị cho Reply Permission */
    const getPermissionLabel = (permission) => {
        if (permission === "following") {
            return t("home:permission_following");
        }
        if (permission === "mentioned") {
            return t("home:permission_mentioned");
        }
        return t("home:permission_everyone");
    };

    const isOwnPost =
        authUser?.username &&
        replyTargetPost?.user?.username &&
        authUser.username === replyTargetPost.user.username;

    const currentPermission = replyTargetPost?.reply_permission || replyPermission;

    return (
        <Dialog open={isReplyDialogOpen} onOpenChange={handleCloseRequest}>
            <DialogContent
                showCloseButton={false}
                onPointerDownOutside={(e) => {
                    if (isModified) {
                        e.preventDefault();
                        setShowConfirm(true);
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (isModified) {
                        e.preventDefault();
                        setShowConfirm(true);
                    }
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className={cn(
                    "bg-threads-content-bg shadow-threads-dialog border-none p-0",
                    "top-auto bottom-0 w-full max-w-full translate-y-0 rounded-t-2xl",
                    "md:top-1/2 md:bottom-auto md:left-1/2 md:w-155 md:max-w-[calc(100vw-32px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl",
                    "border-threads-border-width border-threads-border border-t",
                )}
            >
                {/* Title accessibility */}
                <DialogTitle className="sr-only">
                    {t("home:reply") || "Câu trả lời"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {t("home:reply_description") || "Reply composer dialog"}
                </DialogDescription>

                {/* Header 3 cột */}
                <div className="border-threads-border-width border-threads-border grid h-14 w-full grid-cols-[minmax(64px,140px)_minmax(0,1fr)_minmax(64px,140px)] items-center border-b px-6">
                    <div className="flex h-full items-center justify-start">
                        <button
                            onClick={handleCloseRequest}
                            className="text-threads-text cursor-pointer text-[17px] font-normal transition-transform active:scale-95"
                        >
                            {t("home:cancel")}
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="text-threads-text text-[16px] leading-[1.3125] font-bold">
                            {t("home:reply") || "Câu trả lời"}
                        </h1>
                    </div>

                    <div className="flex items-center justify-end">
                        <QuoteMoreIcon className="text-threads-text h-6 w-6 shrink-0 cursor-pointer" />
                    </div>
                </div>

                {/* Content */}
                <AnimateHeight>
                    <div className="max-h-[calc(100svh-193px)] overflow-y-auto px-6 pt-4 pb-1.25">
                        {/* 1. Hiển thị Bài viết gốc đang được reply ở trên cùng */}
                        {replyTargetPost && (
                            <TargetPostHeader post={replyTargetPost} />
                        )}

                        {/* 2. Soạn thảo danh sách Reply Threads */}
                        {threads.map((thread, index) => {
                            const isLast = index === threads.length - 1;
                            // Thêm customPlaceholder cho block đầu tiên
                            const threadData =
                                index === 0
                                    ? { ...thread, customPlaceholder }
                                    : thread;

                            return (
                                <div
                                    key={thread.id}
                                    className="flex flex-col pb-1.25"
                                >
                                    <div className="flex grow items-start gap-3">
                                        {/* Cột trái: Avatar & Đường Thread */}
                                        <div className="flex flex-col items-center self-stretch pt-1">
                                            <div className="bg-threads-bg h-9 w-9 overflow-hidden rounded-full shrink-0">
                                                <img
                                                    src={userAvatar}
                                                    alt={t("home:my_avatar")}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="relative mt-3 flex min-h-8 grow flex-col items-center">
                                                <div className="bg-threads-border absolute h-full w-0.5 rounded-full" />
                                            </div>
                                        </div>

                                        {/* Cột phải: Vùng nhập liệu */}
                                        <div className="flex grow flex-col">
                                            <CreatePostInput
                                                thread={threadData}
                                                index={index}
                                                total={threads.length}
                                                topic={topic}
                                                onTopicUpdate={updateTopic}
                                                onUpdate={updateThreadContent}
                                                onRemove={removeThread}
                                                isDialogOpen={isReplyDialogOpen}
                                            />
                                        </div>
                                    </div>

                                    {/* Nút Add To Thread */}
                                    {isLast && (
                                        <div className="mt-2.5 flex items-center gap-3">
                                            <div className="flex w-9 justify-center">
                                                <img
                                                    src={userAvatar}
                                                    alt=""
                                                    className="bg-threads-content-bg h-4 w-4 rounded-full object-cover opacity-50"
                                                />
                                            </div>
                                            <span
                                                onClick={addThread}
                                                className={cn(
                                                    "text-threads-dim text-[15px] font-normal transition-opacity",
                                                    !canAddMore
                                                        ? "cursor-not-allowed opacity-40"
                                                        : "cursor-pointer active:opacity-70",
                                                )}
                                            >
                                                {t("home:add_to_thread")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </AnimateHeight>

                {/* Footer */}
                <div className="flex h-21 w-full flex-row-reverse items-center justify-between px-6">
                    <Button
                        variant="outline"
                        onClick={handleSubmitReply}
                        disabled={!canPost || isSubmitting}
                        className={cn(
                            "h-9 rounded-[10px] border px-4 text-[15px] font-semibold transition-all",
                            "border-threads-border text-threads-text bg-transparent shadow-none hover:bg-transparent",
                            !canPost || isSubmitting
                                ? "cursor-not-allowed opacity-40"
                                : "cursor-pointer active:scale-90",
                        )}
                    >
                        {isSubmitting
                            ? t("home:posting") || "Đang đăng..."
                            : t("home:post_btn") || "Đăng"}
                    </Button>

                    {isOwnPost ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex grow cursor-pointer items-center gap-2 transition-opacity active:opacity-60">
                                    <ReplyOptionsIcon className="text-threads-dim h-5 w-5" />
                                    <span className="text-threads-dim text-[15px] font-semibold">
                                        {getPermissionLabel(replyPermission)}
                                    </span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="bg-threads-bg border-threads-border text-threads-text w-64 rounded-xl border p-1 shadow-lg z-[100]">
                                <DropdownMenuItem
                                    onClick={() => setReplyPermission("everyone")}
                                    className="cursor-pointer text-[14px] px-3 py-2 rounded-lg hover:bg-threads-dropdown-hover"
                                >
                                    {t("home:permission_everyone") || "Bất kỳ ai cũng có thể trả lời"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setReplyPermission("following")}
                                    className="cursor-pointer text-[14px] px-3 py-2 rounded-lg hover:bg-threads-dropdown-hover"
                                >
                                    {t("home:permission_following") || "Hồ sơ bạn theo dõi"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setReplyPermission("mentioned")}
                                    className="cursor-pointer text-[14px] px-3 py-2 rounded-lg hover:bg-threads-dropdown-hover"
                                >
                                    {t("home:permission_mentioned") || "Chỉ những người được nhắc đến"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex grow items-center gap-2 text-threads-dim">
                            <ReplyOptionsIcon className="h-5 w-5" />
                            <span className="text-[15px] font-semibold">
                                {getPermissionLabel(currentPermission)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Confirm Dialog đóng bản nháp */}
                <ConfirmCloseDialog
                    isOpen={showConfirm}
                    onOpenChange={setShowConfirm}
                    isQuote={false}
                    onDiscard={handleFinalClose}
                    onSave={() => {
                        toast(t("home:feature_in_development"), {
                            icon: "😭",
                            duration: 2000,
                        });
                        handleFinalClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ReplyModal;
