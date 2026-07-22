import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Component AnimateHeight
 * Mục tiêu: Theo dõi sự thay đổi chiều cao của nội dung bên trong (thêm/xoá thread)
 * và tạo hiệu ứng co giãn mượt mà thay vì giật cục.
 */
export default function AnimateHeight({ children, className }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;

        // Dùng ResizeObserver để lắng nghe thay đổi chiều cao thực tế của thẻ con
        const resizeObserver = new ResizeObserver(() => {
            if (contentRef.current) {
                setHeight(contentRef.current.offsetHeight);
            }
        });

        resizeObserver.observe(contentRef.current);

        // Tránh hiệu ứng cuộn từ 0 lên khi Dialog vừa mở lần đầu
        const timer = setTimeout(() => setIsMounted(true), 50);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timer);
        };
    }, []);

    return (
        <div
            className={cn(
                "overflow-hidden will-change-[height]",
                // Chỉ áp dụng transition khi component đã render xong lần đầu
                isMounted && "transition-[height] duration-300 ease-in-out",
                className,
            )}
            style={{ height: height > 0 ? `${height}px` : "auto" }}
        >
            <div ref={contentRef}>{children}</div>
        </div>
    );
}

AnimateHeight.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
