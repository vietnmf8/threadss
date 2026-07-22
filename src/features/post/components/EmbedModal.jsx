import React from "react";
import PropTypes from "prop-types";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatTime } from "@/utils/dateFormatter";
import { LogoIcon, VerifyIcon } from "@/assets/icons";

const FALLBACK_AVATAR =
    "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

/**
 * Component EmbedModal mở khi bấm nút "Mã nhúng" từ ShareModal
 */
function EmbedModal({ open, onOpenChange, post }) {
    if (!post) return null;

    const user = post.user || {};
    const avatarUrl = user.avatar_url || user.avatar || FALLBACK_AVATAR;
    const createdAt = post.created_at || post.createdAt;
    const media = post.media_urls || post.media || post.images || [];

    const username = user.username || "user";
    const embedUrl = `${window.location.origin}/@${username}/post/${post.id}/embed`;
    const iframeCode = `<iframe src="${embedUrl}" width="540" height="480" frameborder="0" scrolling="no"></iframe>`;

    const handleCopyCode = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        copy(iframeCode);
        toast.success("Đã sao chép mã nhúng vào bộ nhớ tạm");
        // Giữ modal mở, không đóng modal và không nhảy trang
    };

    const handleImageError = (e) => {
        e.target.src = FALLBACK_AVATAR;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onClick={(e) => e.stopPropagation()}
                className="max-w-[560px] w-full bg-threads-bg border border-threads-border text-threads-text rounded-3xl p-6 shadow-2xl focus:outline-none"
            >
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold text-center">
                        Mã nhúng
                    </DialogTitle>
                </DialogHeader>

                <div
                    className="flex flex-col gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Frame Preview / Embed Card Preview */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-threads-dim">
                            Xem trước bản nhúng:
                        </span>
                        
                        {/* Embed Card Box matching Threads preview design */}
                        <div className="w-full bg-threads-bg border border-threads-border rounded-2xl p-4 flex flex-col justify-between shadow-sm max-h-[320px] overflow-y-auto">
                            <div className="flex flex-col gap-2.5">
                                {/* Header: Avatar, Username, Time */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={avatarUrl}
                                            alt={username}
                                            onError={handleImageError}
                                            className="w-9 h-9 rounded-full object-cover border border-threads-border"
                                        />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold text-sm leading-tight text-threads-text">
                                                    {user.name || username}
                                                </span>
                                                {user.verified && (
                                                    <VerifyIcon className="w-3 h-3 text-blue-500" />
                                                )}
                                            </div>
                                            <span className="text-threads-dim text-xs">
                                                @{username}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-threads-dim text-xs">
                                        {createdAt ? formatTime(createdAt) : ""}
                                    </span>
                                </div>

                                {/* Content Text */}
                                {post.content && (
                                    <p className="text-sm text-threads-text leading-relaxed whitespace-pre-line break-words">
                                        {post.content}
                                    </p>
                                )}

                                {/* Media Image */}
                                {media.length > 0 && (
                                    <div className="overflow-hidden rounded-xl border border-threads-border max-h-[160px]">
                                        <img
                                            src={typeof media[0] === "string" ? media[0] : media[0]?.url}
                                            alt="Post media preview"
                                            onError={handleImageError}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Watermark Footer */}
                            <div className="pt-3 mt-3 border-t border-threads-border/50 flex items-center justify-between text-threads-dim text-xs">
                                <div className="flex items-center gap-1.5">
                                    <LogoIcon className="w-4 h-4 text-threads-text" />
                                    <span className="font-semibold text-threads-text">Threads</span>
                                </div>
                                <span className="text-[11px] text-threads-dim">Xem trên Threads</span>
                            </div>
                        </div>
                    </div>

                    {/* Code Textarea */}
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-threads-dim">
                            Mã nhúng HTML:
                        </span>
                        <textarea
                            readOnly
                            rows={3}
                            value={iframeCode}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.target.select();
                            }}
                            className="w-full bg-threads-hover text-threads-text font-mono text-xs rounded-xl p-3 border border-threads-border/60 outline-none resize-none focus:border-threads-border"
                        />
                    </div>

                    {/* Copy Button */}
                    <button
                        type="button"
                        onClick={handleCopyCode}
                        className="w-full py-3 bg-threads-text text-threads-bg font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer text-center"
                    >
                        Sao chép mã
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

EmbedModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    post: PropTypes.object,
};

export default EmbedModal;
