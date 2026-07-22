import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useRefreshTokenMutation, useLazyMeQuery } from "@/services/auth";
import { setCredentials, setUserInfo } from "@/features/auth/authSlice";
import paths from "@/configs/path";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { resetSplash } from "@/features/app/appSlice";
import { useClearApiCache } from "@/hooks/useClearApiCache";

export function useQuickLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation(["auth"]);
    const clearApiCache = useClearApiCache();

    const [lastUser, setLastUser] = useState(null);
    const [refreshTokenApi, { isLoading: isRefreshing }] =
        useRefreshTokenMutation();
    const [triggerGetMe, { isLoading: isFetchingMe }] = useLazyMeQuery();

    const isLoading = isRefreshing || isFetchingMe;

    /* Đọc thông tin user từ LocalStorage khi mount */
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("lastLoggedInUser");
            const storedRefreshToken = localStorage.getItem("refreshToken");

            if (storedUser && storedRefreshToken) {
                setLastUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse lastLoggedInUser", error);
        }
    }, []);

    /* Xử lý hành động Quick Login */
    const handleQuickLogin = async () => {
        const storedRefreshToken = localStorage.getItem("refreshToken");

        // Kiểm tra token trước khi gọi API
        if (!storedRefreshToken) {
            toast.error(t("auth:session_expired"));
            localStorage.removeItem("lastLoggedInUser");
            setLastUser(null);
            navigate(paths.login);
            return;
        }

        try {
            // Gọi API Refresh Token
            const result = await refreshTokenApi({
                refresh_token: storedRefreshToken,
            }).unwrap();

            if (result) {
                // Reset cache RTK Query
                dispatch(resetSplash());
                clearApiCache();

                // Lưu Token mới vào Redux & Storage
                dispatch(
                    setCredentials({
                        accessToken: result.access_token,
                        refreshToken: result.refresh_token,
                    }),
                );

                // Lấy lại thông tin User mới nhất
                const userResult = await triggerGetMe().unwrap();
                dispatch(setUserInfo(userResult));

                // Cập nhật lại thông tin user login gần nhất
                const updatedLastUser = {
                    username: userResult.username,
                    avatar_url: userResult.avatar_url,
                };
                localStorage.setItem(
                    "lastLoggedInUser",
                    JSON.stringify(updatedLastUser),
                );

                toast.success(t("auth:login_success"));
                navigate(paths.home);
            }
        } catch (error) {
            console.error("Quick Login Failed:", error);

            // Xử lý khi Refresh Token hết hạn hoặc không hợp lệ
            toast.error(t("auth:session_expired_login_again"));

            // Xóa dữ liệu rác khi thất bại
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("lastLoggedInUser");
            setLastUser(null);
            navigate(paths.login);
        }
    };

    return {
        lastUser,
        isLoading,
        handleQuickLogin,
    };
}
