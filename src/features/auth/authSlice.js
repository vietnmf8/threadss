import { createSlice } from "@reduxjs/toolkit";

/* info user */
const initialState = {
    // Thông tin user (id, name, email...)
    user: null,
    // accessToken lấy từ localStorage
    accessToken: localStorage.getItem("accessToken") || null,
    // Trạng thái đã xác thực hay chưa
    isAuthenticated: Boolean(localStorage.getItem("accessToken")),
    showGuestDialog: false,
};

/* Slice */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /* Lưu info user khi register/login thành công */
        setCredentials: (state, action) => {
            // Lấy response trả về từ API
            const { accessToken, refreshToken, user } = action.payload;
            state.accessToken = accessToken;
            state.isAuthenticated = true;

            // Lưu vào localStorage
            if (accessToken) localStorage.setItem("accessToken", accessToken);
            if (refreshToken)
                localStorage.setItem("refreshToken", refreshToken);

            // Lưu thông tin user login gần nhất
            if (user) {
                const lastUser = {
                    username: user.username,
                    avatar_url: user.avatar_url,
                };
                localStorage.setItem(
                    "lastLoggedInUser",
                    JSON.stringify(lastUser),
                );
            }
        },

        /* Đăng xuất */
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem("accessToken");
        },

        /* Cập nhật info user (sau khi gọi API auth/me) */
        setUserInfo: (state, action) => {
            state.user = action.payload;
        },

        /* Cập nhật trạng thái Dialog */
        setShowGuestDialog: (state, action) => {
            state.showGuestDialog = action.payload;
        },
    },
});

export const { setCredentials, logout, setUserInfo, setShowGuestDialog } =
    authSlice.actions;
export default authSlice.reducer;
