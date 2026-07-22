import { useState, useEffect, useRef } from "react";

// Bộ nhớ đệm chiều cao nằm ngoài Component để không bị mất khi re-render
const heightCache = new Map();

/**
 * Hook đo chiều cao thực tế của phần tử bằng ResizeObserver
 */
export function useMeasureHeight(id) {
    const measureRef = useRef(null);
    const [height, setHeight] = useState(heightCache.get(id) || 0);

    useEffect(() => {
        const el = measureRef.current;
        if (!el) return;

        /* Lấy kích thước chính xác đến số thập phân */
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const newHeight = entry.contentRect.height;
                if (newHeight > 0 && newHeight !== height) {
                    // Lưu vào cache và cập nhật state
                    heightCache.set(id, newHeight);
                    setHeight(newHeight);
                }
            }
        });

        resizeObserver.observe(el);
        return () => resizeObserver.disconnect();
    }, [id, height]);

    return [measureRef, height];
}
