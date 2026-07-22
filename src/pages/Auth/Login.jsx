import React, { useEffect } from "react";
import LoginForm from "./components/LoginForm";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import paths from "@/configs/path";
import { useClearApiCache } from "@/hooks/useClearApiCache";

function Login() {
    const { setIsQRCodeHidden } = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clearApiCache = useClearApiCache();

    /* Reset trạng thái QR Code khi vào trang Login (luôn hiện) */
    useEffect(() => {
        setIsQRCodeHidden(false);
    }, [setIsQRCodeHidden]);

    /* Kiểm tra xem trang cũ có gửi "bưu kiện" yêu cầu logout không. */
    useEffect(() => {
        if (location.state?.performLogout) {
            dispatch(logout());
            clearApiCache();
            navigate(paths.login, { replace: true, state: {} });
        }
    }, [location.state, dispatch, navigate, clearApiCache]);

    /* Bắn thông báo khi thành công khi Reset-password */
    useEffect(() => {
        // Kiểm tra xem có message từ trang trước gửi sang không
        if (location.state?.message) {
            toast.success(location.state.message, {
                duration: 4000,
                position: "top-center",
            });

            // Xóa state ngay lập tức sau khi đã hiện thông báo
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    return <LoginForm />;
}

export default Login;
