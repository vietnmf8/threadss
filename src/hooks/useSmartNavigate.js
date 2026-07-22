import paths from "@/configs/path";
import { useLocation } from "react-router";

/**
 * Xử lý điều hướng thông minh:
 * - Lần 1: Chuyển trang (nếu khác path)
 * - Lần 2: Cuộn lên đầu (nếu đang ở giữa trang)
 * - Lần 3: Phát tín hiệu Refetch (nếu đã ở đỉnh trang)
 */

export function useSmartNavigate() {
    const location = useLocation();

    const handleSmartClick = (e, targetPath, { onRefetch, isFetching }) => {
        /* Kiểm tra nếu đích đến trùng với URL hiện tại */
        const isSelf = location.pathname === targetPath;

        if (isSelf) {
            e.preventDefault();

            /* Lần 2: Nếu đang cuộn xuống -> Cuộn lên đầu */
            if (window.scrollY > 0) {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
                return;
            }

            // Loại bỏ khả năng phát tín hiệu Refetch cho tab Ghost posts
            const isGhostPath = targetPath === paths.ghost;

            /* Lần 3: Nếu đã ở đỉnh trang -> Phát tín hiệu Refetch (Loại trừ Ghost) */
            if (
                window.scrollY === 0 &&
                onRefetch &&
                !isFetching &&
                !isGhostPath
            ) {
                onRefetch();
            }
        }
    };

    return { handleSmartClick };
}
