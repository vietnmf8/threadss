import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useGetFeedQuery } from "@/services/post";
import paths from "@/configs/path";
import { useEffect, useMemo, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useRefetchSignal } from "@/hooks/useRefetchSignal";
import { getFeedTypeByPath } from "@/pages/Home/helpers";

export function useHomeFeed(explicitType = null) {
    const location = useLocation();
    const currentPath = location.pathname;
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { isSplashFinished } = useSelector((state) => state.app);

    /* Quản lý state cho phân trang và dữ liệu gộp */
    const [page, setPage] = useState(1);

    /* Cờ đánh dấu user chủ động Click Refetch */
    const [isManualRefetching, setIsManualRefetching] = useState(false);

    /* Xác định feedType cố định cho instance này */
    const feedType = useMemo(
        () => explicitType || getFeedTypeByPath(currentPath),
        [explicitType, currentPath],
    );

    /* * Kiểm tra xem tab hiện tại có đang hiển thị trên màn hình không*/
    const isActiveTab = useMemo(() => {
        return getFeedTypeByPath(currentPath) === feedType;
    }, [currentPath, feedType]);

    /* Xác định các path thuộc về Home Feed */
    const isFeedPath = [
        paths.home,
        paths.following,
        paths.ghost_posts,
    ].includes(currentPath);

    /* Gọi API lấy danh sách bài viết */
    const {
        data: apiResponse,
        isLoading: isApiLoading,
        isFetching,
        isError,
        refetch,
    } = useGetFeedQuery(
        { type: feedType, page },
        {
            skip: !isFeedPath || !isSplashFinished,
            refetchOnMountOrArgChange: false, //! Cân nhắc ẩn..!!
        },
    );

    /* Lắng nghe tín hiệu Click từ Header/Sidebar */
    useRefetchSignal(
        "home",
        async () => {
            if (feedType === "ghost") return;
            setIsManualRefetching(true); // Hiện loading refetch
            setPage(1);
            await refetch();
            setIsManualRefetching(false); // Ẩn loading refetch
        },
        isFeedPath && isActiveTab,
    );

    /* Reset local state khi chuyển tab */
    useEffect(() => {
        setPage(1);
    }, [feedType]);

    /* Tính toán hasMore từ pagination */
    const hasMore = useMemo(() => {
        const pagination = apiResponse?.pagination;
        if (!pagination) return true;
        return pagination.current_page < pagination.last_page;
    }, [apiResponse?.pagination]);

    /* Hàm load trang tiếp theo */
    const loadMore = () => {
        if (!isFetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    /* Xác định trạng thái khởi tạo: 
    có data hoặc đã load xong page 1 */
    const isInitialized = !!apiResponse;

    /* Tích hợp thư viện Infinite Scroll */
    const [sentryRef] = useInfiniteScroll({
        loading: isFetching,
        hasNextPage: hasMore,
        onLoadMore: loadMore,
        disabled: !!isError || !isInitialized,
        rootMargin: "0px 0px 400px 0px", // Load trước khi chạm đáy 400px cho mượt
    });

    return {
        feedData: apiResponse?.data || [],
        isLoading: isApiLoading && !apiResponse,
        isFetching,
        isManualRefetching,
        isError,
        isGhostTab: feedType === "ghost",
        isAuthenticated,
        hasData: (apiResponse?.data || []).length > 0,
        sentryRef,
        hasMore,
        isInitialized,
    };
}
