import React from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { FEED_TABS } from "@/configs/feedTabs";
import HeaderTabItem from "./HeaderTabItem";
import BunnyEars from "./BunnyEars";
import HeaderMoreAction from "./HeaderMoreAction";
import { useSelector } from "react-redux";
import { HEADER_CONFIG } from "@/configs/headerConfig";
import { useSmartNavigate } from "@/hooks/useSmartNavigate";
import PropTypes from "prop-types";

function FeedHeader({ onRefetch, isFetching }) {
    const { t } = useTranslation(["home"]);
    const location = useLocation();
    const currentPath = location.pathname;

    /* Khởi tạo logic điều hướng thông minh */
    const { handleSmartClick } = useSmartNavigate();

    const handleClickTitle = (e) => {
        handleSmartClick(e, currentPath, { onRefetch, isFetching });
    };

    /* Lấy trạng thái đăng nhập từ Redux */
    const { isAuthenticated } = useSelector((state) => state.auth);

    /* Lấy Config cho trang hiện tại */
    const currentConfig = HEADER_CONFIG[currentPath] || {};

    /* Lấy ra Tab hiện tại (Cho logic hiển thị Menu Action) */
    const currentTab =
        FEED_TABS.find((tab) => tab.path === currentPath) || FEED_TABS[0];

    /* Logic hiển thị khu vực giữa (Center) */
    const showTabs = isAuthenticated && currentConfig.showTabs;

    /* Logic lấy Title (Mặc định là Home) */
    const titleKey = currentConfig.titleKey || "home_title";

    return (
        <div className="sticky top-0 z-30 hidden min-h-15 w-full max-w-full items-center justify-center md:flex">
            {/* Fake Top Border */}
            <BunnyEars />

            {/* Main Tab */}
            <div className="bg-threads-bg absolute -right-3 -left-3 grid h-full grid-cols-[1fr_minmax(auto,80%)_1fr] content-center justify-center gap-x-4 px-4">
                <div className="flex w-11 items-center justify-start pl-2">
                    <div className="h-0 w-9" />
                </div>

                {/* Center Content (Tabs hoặc Title) */}
                <div className="flex h-full max-w-full items-center justify-center">
                    {showTabs ? (
                        /* Hiển thị Tabs (Đã đăng nhập & Trang có Tabs) */
                        <div className="flex flex-row items-center justify-center">
                            {FEED_TABS.map((tab) => (
                                <HeaderTabItem
                                    key={tab.id}
                                    tab={tab}
                                    isActive={currentPath === tab.path}
                                    t={t}
                                    onRefetch={onRefetch}
                                    isFetching={isFetching}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Chế độ khách: Hiển thị Title */
                        <Link
                            to={currentPath}
                            onClick={handleClickTitle}
                            className="text-threads-base leading-5.25 font-semibold"
                        >
                            {t(`home:${titleKey}`)}
                        </Link>
                    )}
                </div>

                {/* Right Action (More Button) */}
                <div className="flex items-center justify-end pr-2">
                    {isAuthenticated && (
                        // Chỉ hiển thị khi đã đăng nhập
                        <HeaderMoreAction
                            actions={currentTab?.menuActions || []}
                            t={t}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

FeedHeader.propTypes = {
    onRefetch: PropTypes.func,
    isFetching: PropTypes.bool,
};

export default FeedHeader;
