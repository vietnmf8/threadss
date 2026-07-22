import httpRequest from "@/utils/httpRequest";

const baseQuery = async (args) => {
    /* Kiểm tra xem args từ hàm query trả về có phải là object hay không? */
    const isObject = typeof args === "object";

    /* Config Request Axios */
    const config = {
        url: isObject ? args.url : args,
        method: isObject ? args.method : "GET",
    };

    /* Optional */
    if (isObject) {
        if (args.body) config.data = args.body;
        if (args.headers) config.headers = args.headers;
        if (args.params) config.params = args.params;
    }

    try {
        /* Response từ API trả về */
        const response = await httpRequest(config);

        // Trả về toàn bộ object response (chứa success, data, pagination)
        if (isObject && args.fullResponse) {
            return { data: response };
        }

        return { data: response.data };
    } catch (error) {
        return {
            /* Trả về lỗi nếu gọi API thất bại */
            error: {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            },
        };
    }
};

export default baseQuery;
