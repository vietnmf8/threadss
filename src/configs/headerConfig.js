import paths from "./path";

/**
 * HEADER_CONFIG
 * Cấu hình hiển thị Header cho từng trang
 */
export const HEADER_CONFIG = {
    /* Các Tab trong Home Context */
    [paths.home]: {
        titleKey: "home_title",
        showTabs: true, // Chỉ hiển thị Tabs khi đã đăng nhập
    },
    [paths.following]: {
        titleKey: "home_title",
        showTabs: true,
    },
    [paths.ghost_posts]: {
        titleKey: "home_title",
        showTabs: true,
    },

    /* Các page còn lại */
    [paths.search]: {
        titleKey: "search_title",
        showTabs: false, // Luôn hiển thị Title text
    },
    [paths.activity]: {
        titleKey: "activity_title",
        showTabs: false,
    },
    [paths.profile]: {
        titleKey: "profile_title",
        showTabs: false,
    },
};