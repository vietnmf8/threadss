import { useFormWithI18n } from "@/hooks/useFormWithI18n";
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "@/schemas/loginSchema";
import { useLazyMeQuery, useLoginMutation } from "@/services/auth";
import { setCredentials, setUserInfo } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import paths from "@/configs/path";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { resetSplash } from "@/features/app/appSlice";
import { useClearApiCache } from "@/hooks/useClearApiCache";

export function useLoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(["auth"]);
    const clearApiCache = useClearApiCache();

    /* Init Form */
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useFormWithI18n({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    /* API Hooks */
    const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
    const [triggerGetMe, { isLoading: isFetchingMe }] = useLazyMeQuery();

    /* Biến loading tổng hợp để disable nút */
    const isLoading = isLoggingIn || isFetchingMe;

    /* Xử lý Submit */
    const onSubmit = async (data) => {
        try {
            // Chuẩn hóa payload
            const payload = {
                login: data.email,
                password: data.password,
            };

            // Gọi API Login
            const result = await loginApi(payload).unwrap();

            if (result) {
                // Xoá cache cũ của RTK Query để tránh lặp dữ liệu cũ
                dispatch(resetSplash());
                clearApiCache();

                // Lưu tạm accessToken vào localStorage ngay lập tức
                localStorage.setItem("accessToken", result.access_token);

                // Gọi API lấy User Info
                const userResult = await triggerGetMe().unwrap();

                // Lưu thông tin user info và Redux và localStorage
                dispatch(
                    setCredentials({
                        accessToken: result.access_token,
                        refreshToken: result.refresh_token,
                        user: userResult,
                    }),
                );

                // Lưu User Info vào Redux Store
                dispatch(setUserInfo(userResult));

                // Thông báo & Chuyển trang
                toast.success(t("auth:login_success"));
                navigate(paths.home);
            }
        } catch (error) {
            console.error("Login Flow Error:", error);

            // Nếu lỗi xảy ra giữa chừng, xóa token tạm để tránh rác
            localStorage.removeItem("accessToken");

            const errorMessage =
                t("auth:login_failed_default") || error?.data?.message;
            toast.error(errorMessage);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        isLoading,
        watch,
    };
}
