import { RepostIcon, QuoteIcon } from "@/assets/icons";

/* Cấu hình các item cho menu Repost */
export const getRepostMenuOptions = (isReposted) => [
    {
        id: "repost",
        labelKey: isReposted ? "home:remove_repost" : "home:repost",
        Icon: RepostIcon,
        isDanger: isReposted,
        action: "TOGGLE_REPOST",
    },
    {
        id: "quote",
        labelKey: "home:quote",
        Icon: QuoteIcon,
        isDanger: false,
        action: "QUOTE",
    },
];
