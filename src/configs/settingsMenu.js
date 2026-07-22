import { ACTION_TYPES, VIEW_TYPES } from "./constants";

export const SETTINGS_GROUPS = [
    /* Group 1: Cài đặt chung */
    [
        {
            labelKey: "appearance",
            icon: "next",
            action: ACTION_TYPES.NAVIGATE,
            targetView: VIEW_TYPES.THEME,
            guestAllowed: true,
        },
        { labelKey: "insights", action: ACTION_TYPES.INSIGHTS },
        { labelKey: "settings", action: ACTION_TYPES.SETTINGS },
    ],

    /* Group 2: Hoạt động & Feed */
    [
        {
            labelKey: "feed",
            icon: "next",
            action: ACTION_TYPES.NAVIGATE,
            targetView: VIEW_TYPES.FEED,
        },
        { labelKey: "saved", action: ACTION_TYPES.SAVED },
        { labelKey: "liked", action: ACTION_TYPES.LIKED },
    ],

    /* Group 3: Hệ thống */
    [
        {
            labelKey: "report_problem",
            action: ACTION_TYPES.REPORT,
            guestAllowed: true,
        },
        {
            labelKey: "log_out",
            action: ACTION_TYPES.LOGOUT,
            variant: "destructive",
        },
    ],
];
