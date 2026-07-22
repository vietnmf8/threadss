export const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Dưới 1 phút
    if (diffInSeconds < 60) {
        return "vừa xong";
    }

    // Dưới 1 giờ (trả về số phút + 'm')
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    }

    // Dưới 24 giờ (trả về số giờ + 'h')
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }

    // Dưới 7 ngày (trả về số ngày + 'd')
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d`;
    }

    // Trên 7 ngày (trả về số tuần + 'w') hoặc ngày cụ thể
    // Threads thường hiển thị số tuần nếu < 1 năm
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
};
