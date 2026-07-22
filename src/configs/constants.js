import paths from "./path";

/* Thông số cho hệ thống Virtualization chuẩn Threads */
export const VIRTUALIZATION_CONFIG = {
    BUFFER_ZONE: "200px 0px", // Vùng đệm (trên/dưới) để kích hoạt pre-render
    DEFAULT_HEIGHT: 200, // Chiều cao ước lượng ban đầu (pixel)
};

export const ACTION_TYPES = {
    /* Nhóm điều hướng */
    NAVIGATE: "NAVIGATE",

    /* Nhóm tác vụ */
    THEME: "THEME",
    INSIGHTS: "INSIGHTS",
    SETTINGS: "SETTINGS",
    SAVED: "SAVED",
    LIKED: "LIKED",
    REPORT: "REPORT",

    /* Nhóm Auth */
    LOGOUT: "LOGOUT",

    /* Nhóm Feed */
    CREATE_FEED: "CREATE_FEED",
    ADD_COLUMN: "ADD_COLUMN",
};

/* View: Main Menu & Sub Menu */
export const VIEW_TYPES = {
    MAIN: "MAIN",
    FEED: "FEED",
    THEME: "THEME",
};

/*  Danh sách các đường dẫn bắt buộc phải có Token */
export const PROTECTED_PATHS = [paths.profile, paths.activity];
