import { useState, useCallback } from "react";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import * as htmlToImage from "html-to-image";

/**
 * Custom Hook xử lý logic cho Share Modal, Copy Link, Copy Image & Open Embed
 */
export const useSharePost = ({ post, onOpenEmbed, cardRef }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    /* 1. Xử lý Sao chép liên kết */
    const handleCopyLink = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!post) return;
        const username = post.user?.username || "user";
        const url = `${window.location.origin}/@${username}/post/${post.id}`;
        copy(url);
        toast.success("Đã sao chép liên kết vào bộ nhớ tạm");
    }, [post]);

    /* 2. Xử lý Sao chép dưới dạng hình ảnh */
    const handleCopyAsImage = useCallback(async (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!cardRef?.current || !post) {
            toast.error("Không tìm thấy dữ liệu bài viết để tạo ảnh");
            return;
        }
        try {
            setIsExporting(true);
            const node = cardRef.current;
            const dataUrl = await htmlToImage.toPng(node, {
                quality: 0.95,
                pixelRatio: 2,
                cacheBust: false,
                skipFonts: true,
                preferredFontFormat: "woff2",
            });

            /* Tải file ảnh .png về máy */
            const link = document.createElement("a");
            link.download = `threads-post-${post.id}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            /* Thử sao chép blob ảnh vào Clipboard nếu trình duyệt hỗ trợ */
            try {
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                if (navigator.clipboard && window.ClipboardItem) {
                    await navigator.clipboard.write([
                        new ClipboardItem({ "image/png": blob }),
                    ]);
                }
            } catch (clipErr) {
                console.warn("ClipboardItem unsupported or permission denied:", clipErr);
            }

            toast.success("Đã tải và sao chép bài viết dưới dạng hình ảnh");
        } catch (err) {
            console.error("Export image error:", err);
            toast.error("Không thể tạo hình ảnh từ bài viết này");
        } finally {
            setIsExporting(false);
        }
    }, [cardRef, post]);

    /* 3. Xử lý Mở Embed Modal */
    const handleOpenEmbed = useCallback((e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (onOpenEmbed) {
            onOpenEmbed();
        }
    }, [onOpenEmbed]);

    return {
        isExporting,
        searchQuery,
        setSearchQuery,
        handleCopyLink,
        handleCopyAsImage,
        handleOpenEmbed,
    };
};
