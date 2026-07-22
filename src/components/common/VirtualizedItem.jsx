import React, { useMemo, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useInView } from "@/hooks/useInView";
import { useMeasureHeight } from "@/hooks/useMeasureHeight";
import { VIRTUALIZATION_CONFIG } from "@/configs/constants.js";

/**
 * Ảo hóa bài viết với cơ chế "Freeze State" và "Anti-Flicker"
 */
const VirtualizedItem = ({ id, children, isActiveTab }) => {
    // rootMargin 1000px giúp tải trước nội dung khi sắp cuộn tới
    const [containerRef, inView] = useInView({
        rootMargin: VIRTUALIZATION_CONFIG.BUFFER_ZONE,
    });

    // Đo chiều cao thực tế của bài viết để giữ chỗ khi bị unmount
    const [measureRef, cachedHeight] = useMeasureHeight(id);

    // 3. State nội bộ quyết định việc render nội dung
    // Mặc định ban đầu là true để tránh nháy (hiện nội dung ngay lập tức)
    const [shouldRender, setShouldRender] = useState(true);

    // Sử dụng ref để đánh dấu trạng thái mount lần đầu
    const isFirstMount = useRef(true);

    /* Logic Anti-Flicker & Đóng băng trạng thái */
    useEffect(() => {
        // TRƯỜNG HỢP 1: Tab đang ẩn (Freeze State)
        // Không cập nhật shouldRender để giữ nguyên trạng thái hiển thị cuối cùng
        if (!isActiveTab) return;

        // TRƯỜNG HỢP 2: Tab đang hiện (Active)
        // Sử dụng cơ chế trì hoãn (debounce) để Observer có thời gian tính toán chính xác
        // Lần đầu mount (Anti-Flicker): Chờ 100ms trước khi cho phép ảo hóa ẩn nội dung
        // Các lần sau (Normal): Chờ 50ms để xử lý mượt mà khi cuộn nhanh
        const delay = isFirstMount.current ? 100 : 50;

        const timeoutId = setTimeout(() => {
            // Sau khi hết delay, cập nhật render dựa trên trạng thái inView thực tế
            setShouldRender(inView);

            // Sau lần chạy đầu tiên, đánh dấu đã mount thành công
            if (isFirstMount.current) {
                isFirstMount.current = false;
            }
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [inView, isActiveTab]);

    // Trạng thái ảo hóa: Khi bài viết ở xa (không render) và đã biết chiều cao để giữ chỗ
    const isVirtualized = !shouldRender && cachedHeight > 0;

    // Tính toán style để giữ nguyên Layout (tránh nhảy trang khi cuộn)
    const style = useMemo(
        () => ({
            minHeight: isVirtualized ? `${cachedHeight}px` : undefined,
        }),
        [isVirtualized, cachedHeight],
    );

    return (
        <div
            ref={containerRef}
            style={style}
            className="w-full"
            data-virtualized={isVirtualized}
        >
            {/* Nếu không ảo hóa thì render nội dung thực và đo chiều cao */}
            {!isVirtualized ? <div ref={measureRef}>{children}</div> : null}
        </div>
    );
};

VirtualizedItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    children: PropTypes.node.isRequired,
    isActiveTab: PropTypes.bool.isRequired,
};

export default VirtualizedItem;
