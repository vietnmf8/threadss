import { useDispatch } from "react-redux";
import { authApi } from "@/services/auth";
import { postApi } from "@/services/post";

/**
 * Hook chuyên dụng để dọn dẹp toàn bộ cache của các API.
 */
export function useClearApiCache() {
    const dispatch = useDispatch();

    const clearAll = () => {
        dispatch(authApi.util.resetApiState());
        dispatch(postApi.util.resetApiState());
        //...
    };

    return clearAll;
}
