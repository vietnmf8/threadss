import paths from "@/configs/path";

/**
 * Xác định Feed Type dựa trên đường dẫn hiện tại.
 */
export const getFeedTypeByPath = (path) => {
    if (path === paths.following) return "following";
    if (path === paths.ghost_posts) return "ghost";
    return "for_you";
};
