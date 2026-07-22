import React, { useRef } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    InstagramIcon,
    SearchIcon,
    ShareIcon,
    MediaIcon,
} from "@/assets/icons";
import { useSharePost } from "../hooks/useSharePost";
import PostExportCard from "./PostExportCard";

/**
 * ShareModal component dựng lại theo wireframe (sample/wireframe.html)
 * Đồng bộ hệ thống theme dark/light, icons dự án và hỗ trợ responsive
 */
function ShareModal({ open, onOpenChange, post, onOpenEmbed }) {
    const cardRef = useRef(null);

    const {
        isExporting,
        searchQuery,
        setSearchQuery,
        handleCopyLink,
        handleCopyAsImage,
        handleOpenEmbed,
    } = useSharePost({
        post,
        onOpenEmbed: () => {
            onOpenChange(false);
            if (onOpenEmbed) onOpenEmbed();
        },
        cardRef,
    });

    if (!post) return null;

    return (
        <>
            {/* Component thẻ xuất ảnh ẩn */}
            <PostExportCard post={post} cardRef={cardRef} />

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    showCloseButton={false}
                    onClick={(e) => e.stopPropagation()}
                    className="p-0 border-none bg-transparent max-w-[820px] w-full overflow-hidden focus:outline-none"
                >
                    <DialogTitle className="sr-only">Chia sẻ bài viết</DialogTitle>

                    <div
                        className="w-full bg-threads-bg border border-threads-border rounded-3xl overflow-hidden shadow-2xl transition-colors duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-threads-border/60 bg-threads-bg">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenChange(false);
                                }}
                                className="text-threads-text hover:opacity-70 text-base font-normal bg-transparent border-none cursor-pointer transition-opacity"
                            >
                                Hủy
                            </button>
                            <span className="text-threads-text text-lg font-semibold">
                                Gửi đến
                            </span>
                            {/* Dummy text để căn giữa tiêu đề */}
                            <span className="text-base opacity-0 select-none pointer-events-none">
                                Hủy
                            </span>
                        </div>

                        {/* Search area */}
                        <div className="px-6 py-4 border-b border-threads-border/60 bg-threads-bg">
                            <div className="relative flex items-center">
                                <div className="absolute left-4 flex items-center pointer-events-none text-threads-dim">
                                    <SearchIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm trang cá nhân Threads"
                                    className="w-full bg-threads-hover text-threads-text placeholder:text-threads-dim text-base font-normal rounded-full pl-11 pr-5 py-3 border border-threads-border/40 outline-none focus:border-threads-border transition-colors"
                                />
                            </div>
                        </div>

                        {/* User list placeholder area */}
                        <div className="min-h-[200px] flex items-center justify-center p-6 text-threads-dim text-sm text-center">
                            {searchQuery ? (
                                <span>Không tìm thấy người dùng phù hợp</span>
                            ) : (
                                <span>Chọn người dùng để gửi trực tiếp hoặc chọn tính năng bên dưới</span>
                            )}
                        </div>

                        {/* Action bar (Footer) */}
                        <div className="border-t border-threads-border/60 px-6 py-6 bg-threads-bg">
                            <div className="flex items-start justify-around gap-2 sm:gap-4">
                                {/* 1. Tin trên Instagram */}
                                <div className="flex flex-col items-center gap-2.5 flex-1 min-w-[70px]">
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-threads-hover hover:bg-threads-border/30 flex items-center justify-center border border-threads-border/40 transition-all cursor-pointer group"
                                        title="Tin trên Instagram"
                                    >
                                        <InstagramIcon className="w-7 h-7 text-threads-text group-hover:scale-105 transition-transform" />
                                    </button>
                                    <span className="text-threads-text text-xs font-normal text-center leading-tight">
                                        Tin trên<br />Instagram
                                    </span>
                                </div>

                                {/* 2. Sao chép liên kết */}
                                <div className="flex flex-col items-center gap-2.5 flex-1 min-w-[70px]">
                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-threads-hover hover:bg-threads-border/30 flex items-center justify-center border border-threads-border/40 transition-all cursor-pointer group"
                                        title="Sao chép liên kết"
                                    >
                                        <ShareIcon className="w-6 h-6 text-threads-text group-hover:scale-105 transition-transform" />
                                    </button>
                                    <span className="text-threads-text text-xs font-normal text-center leading-tight">
                                        Sao chép liên<br />kết
                                    </span>
                                </div>

                                {/* 3. Sao chép dưới dạng hình ảnh */}
                                <div className="flex flex-col items-center gap-2.5 flex-1 min-w-[70px]">
                                    <button
                                        type="button"
                                        disabled={isExporting}
                                        onClick={handleCopyAsImage}
                                        className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-threads-hover hover:bg-threads-border/30 flex items-center justify-center border border-threads-border/40 transition-all cursor-pointer group disabled:opacity-50"
                                        title="Sao chép dưới dạng hình ảnh"
                                    >
                                        <MediaIcon className="w-6 h-6 text-threads-text group-hover:scale-105 transition-transform" />
                                    </button>
                                    <span className="text-threads-text text-xs font-normal text-center leading-tight">
                                        {isExporting ? "Đang xuất..." : <>Sao chép dưới<br />dạng hình ảnh</>}
                                    </span>
                                </div>

                                {/* 4. Mã nhúng */}
                                <div className="flex flex-col items-center gap-2.5 flex-1 min-w-[70px]">
                                    <button
                                        type="button"
                                        onClick={handleOpenEmbed}
                                        className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-threads-hover hover:bg-threads-border/30 flex items-center justify-center border border-threads-border/40 transition-all cursor-pointer group"
                                        title="Mã nhúng"
                                    >
                                        {/* Inline Globe / Embed Icon */}
                                        <svg
                                            className="w-6 h-6 text-threads-text group-hover:scale-105 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z"
                                            />
                                        </svg>
                                    </button>
                                    <span className="text-threads-text text-xs font-normal text-center leading-tight">
                                        Mã nhúng
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

ShareModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    post: PropTypes.object,
    onOpenEmbed: PropTypes.func,
};

export default ShareModal;
