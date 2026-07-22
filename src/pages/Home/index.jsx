import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import FeedHeader from "../../layouts/common/FeedHeader";
import FeedContent from "../../layouts/common/FeedContent";
import { useDispatch, useSelector } from "react-redux";
import { emitRefetchSignal } from "@/features/app/appSlice";
import { useLocation } from "react-router";
import FeedList from "./components/FeedList";
import { getFeedTypeByPath } from "./helpers";
import { FEED_TABS } from "@/configs/feedTabs";
import paths from "@/configs/path";
import HeaderTabItem from "@/layouts/common/HeaderTabItem";
import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation(["home"]);
    const location = useLocation();
    const currentPath = location.pathname;
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    /* Xác định ID tab hiện tại */
    const activeTabId = getFeedTypeByPath(currentPath);

    /* Lọc danh sách tab dành riêng cho Mobile */
    const mobileVisibleTabs = useMemo(
        () => FEED_TABS.filter((tab) => !tab.hiddenOnMobile),
        [],
    );

    /* Lưu trữ tọa độ cuộn của từng tab  */
    const scrollPositionsRef = useRef({
        for_you: 0,
        following: 0,
        ghost: 0,
    });

    /* Lưu vết tọa độ thực tế cuối cùng trước khi chuyển tab */
    const lastKnownScrollRef = useRef(0);
    const prevTabIdRef = useRef(activeTabId);

    /* Cập nhật tọa độ thực tế của Window liên tục */
    useEffect(() => {
        const handleScroll = () => {
            lastKnownScrollRef.current = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* SNAPSHOT*/
    useLayoutEffect(() => {
        // Snapshot: Lưu vị trí của tab cũ trước khi nó bị ẩn (display: none)
        if (prevTabIdRef.current !== activeTabId) {
            scrollPositionsRef.current[prevTabIdRef.current] =
                lastKnownScrollRef.current;
        }

        // Khôi phục: Lấy tọa độ đã lưu của tab mới
        const savedPosition = scrollPositionsRef.current[activeTabId] || 0;

        // Nhảy đến vị trí cũ ngay lập tức
        window.scrollTo(0, savedPosition);

        // Update: Cập nhật Ref theo dõi để sẵn sàng cho lần cuộn tiếp theo
        lastKnownScrollRef.current = savedPosition;
        prevTabIdRef.current = activeTabId;
    }, [activeTabId]);

    /* Lấy trạng thái fetching trang 1 của Tab đang active để hiện loading trên Header */
    const isFetchingPageOne = useSelector((state) => {
        const queryKey = `getFeed({"type":"${activeTabId}"})`;
        const queryState = state.postApi?.queries?.[queryKey];

        return (
            queryState?.status === "pending" &&
            queryState?.originalArgs?.page === 1
        );
    });

    /* Logic phát tín hiệu Refetch từ Header */
    const handleHeaderRefetch = () => {
        // Không phát tín hiệu nếu đang ở tab Ghost
        if (currentPath === paths.ghost) return;
        dispatch(emitRefetchSignal("home"));
    };

    return (
        <>
            {/* Header chứa các tab điều hướng */}
            <FeedHeader
                onRefetch={handleHeaderRefetch}
                isFetching={isFetchingPageOne}
            />
            <FeedContent>
                {/* Mobile Tab  */}
                {isAuthenticated && (
                    <div className="border-threads-border/80 flex h-[49.5px] w-full border-b-[1.5px] md:hidden">
                        {mobileVisibleTabs.map((tab) => (
                            <HeaderTabItem
                                key={tab.id}
                                tab={tab}
                                isActive={currentPath === tab.path}
                                t={t}
                                onRefetch={handleHeaderRefetch}
                                isFetching={isFetchingPageOne}
                                className="h-12!"
                            />
                        ))}
                    </div>
                )}

                {/* Desktop Tab */}
                {FEED_TABS.map((tab) => {
                    const tabType = getFeedTypeByPath(tab.path);
                    const isActive = activeTabId === tabType;

                    return (
                        <div
                            key={tab.id}
                            className={isActive ? "block min-h-full" : "hidden"}
                        >
                            <FeedList type={tabType} isActive={isActive} />
                        </div>
                    );
                })}
            </FeedContent>
        </>
    );
}

export default Home;
