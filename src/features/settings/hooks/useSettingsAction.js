import { useNavigate } from "react-router";
import paths from "@/configs/path";
import { ACTION_TYPES } from "@/configs/constants";

export function useSettingsAction(setView) {
    const navigate = useNavigate();

    /* Điều hướng  Menu (VD: Main -> Feed) */
    const handleAction = (item) => {
        if (item.action === ACTION_TYPES.NAVIGATE && item.targetView) {
            setView(item.targetView);
            return;
        }

        /* Xử lý các hành động */
        switch (item.action) {
            // Chuyển hướng sang trang Login và gửi kèm một flag 'performLogout'
            case ACTION_TYPES.LOGOUT:
                navigate(paths.login, {
                    replace: true,
                    state: { performLogout: true },
                });
                break;

            case ACTION_TYPES.THEME:
                // todo: Xử lý đổi theme
                console.log("Toggle đổi theme");
                break;

            // ...
            default:
                console.warn("Hành động chưa được xử lý", item.action);
                break;
        }
    };

    /* Chuyển hướng trang */
    const handleNavigate = (path) => {
        navigate(path);
    };

    return { handleAction, handleNavigate };
}
