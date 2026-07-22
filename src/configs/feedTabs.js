import { AddColumnIcon, AddNewFeedIcon, GhostPostsIcon } from "@/assets/icons";
import paths from "@/configs/path";
import { ACTION_TYPES } from "./constants";

export const FEED_TABS = [
    /* Tab: Dành cho bạn */
    {
        id: "for_you",
        path: paths.home,
        labelKey: "for_you",
        hiddenOnMobile: false,
        menuActions: [
            {
                action: ACTION_TYPES.CREATE_FEED,
                labelKey: "create_new_feed",
                Icon: AddNewFeedIcon,
            },
        ],
    },

    /* Tab: Đang theo dõi */
    {
        id: "following",
        path: paths.following,
        labelKey: "following",
        hiddenOnMobile: false,
        menuActions: [
            {
                action: ACTION_TYPES.ADD_COLUMN,
                labelKey: "add_as_column",
                Icon: AddColumnIcon,
            },
        ],
    },

    /* Tab: Bài viết tự huỷ */
    {
        id: "ghost",
        path: paths.ghost_posts,
        labelKey: "ghost_posts",
        Icon: GhostPostsIcon,
        hiddenOnMobile: true,
        menuActions: [
            {
                action: ACTION_TYPES.ADD_COLUMN,
                labelKey: "add_as_column",
                Icon: AddColumnIcon,
            },
        ],
        emptyState: "GhostEmptyState",
    },
];
