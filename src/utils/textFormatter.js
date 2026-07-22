/**
 * Helper định dạng văn bản snake_case sang dạng chữ viết hoa đầu từ thân thiện
 * Ví dụ: "community_or_topic" -> "Community Or Topic", "ghost_posts" -> "Ghost Posts"
 */
export const formatSnakeCaseText = (text) => {
    if (!text || typeof text !== "string") return "";
    return text
        .split("_")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
