import { useDispatch, useSelector } from "react-redux";
import paths from "@/configs/path";
import { setShowGuestDialog } from "../authSlice";

/**
 * Quản lý logic chặn người dùng chưa đăng nhập (Guest)
 */
export function useGuestLogin() {
    /* Lấy trạng thái đăng nhập từ Redux */
    const dispatch = useDispatch();
    const { isAuthenticated, showGuestDialog } = useSelector(
        (state) => state.auth,
    );

    /* Mở Dialog */
    const _setShowGuestDialog = (value) => {
        dispatch(setShowGuestDialog(value));
    };

    /* Danh sách các path/action cần yêu cầu đăng nhập */
    const RESTRICTED_PATHS = [
        paths.activity, // Trang Activity
        paths.profile, // Trang Profile
    ];

    /* Hàm chặn chuyển trang */
    const handleProtectedAction = (e, item) => {
        // Nếu đã đăng nhập thì bỏ qua
        if (isAuthenticated) return;

        // 1. Là hành động Create (luôn chặn Guest)
        const isCreateAction = item.isCreate;

        // 2. Là các trang giới hạn (Restricted Pages)
        const isRestrictedPath = RESTRICTED_PATHS.includes(item.path);
        if (isCreateAction || isRestrictedPath) {
            e.preventDefault(); // Chặn chuyển trang / hành động mặc định
            e.stopPropagation(); // Chặn nổi bọt
            _setShowGuestDialog(true); // Mở Dialog
        }
    };

    return {
        showGuestDialog,
        setShowGuestDialog: _setShowGuestDialog,
        handleProtectedAction,
    };
}
