import { useEffect, useRef } from "react";

/**
 * Tự động đóng menu khi resize màn hình cắt ngang qua một breakpoint cụ thể.
 */
export function useAutoCloseMenu(isOpen, onClose, breakpoint = 700) {
    const prevWidthRef = useRef(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const prevWidth = prevWidthRef.current;

            // Kiểm tra xem có băng qua điểm gãy (breakpoint) không
            const isCrossed =
                (prevWidth <= breakpoint && currentWidth > breakpoint) ||
                (prevWidth > breakpoint && currentWidth <= breakpoint);

            if (isCrossed && isOpen) {
                onClose();
            }

            // Cập nhật lại chiều rộng cũ cho lần resize tiếp theo
            prevWidthRef.current = currentWidth;
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpen, onClose, breakpoint]);
}
