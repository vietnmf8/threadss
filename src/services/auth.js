import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        /* Đăng ký */
        register: builder.mutation({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),

        /* Đăng nhập */
        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),

        /* Làm mới Token (Quick Login) */
        refreshToken: builder.mutation({
            query: (body) => ({
                url: "/auth/refresh",
                method: "POST",
                body,
            }),
        }),

        /* Lấy thông tin User hiện tại */
        me: builder.query({
            query: () => "auth/user",
            providesTags: ["User"],
        }),

        /* Kiểm tra Email tồn tại (Validate) */
        checkEmail: builder.mutation({
            query: (email) => ({
                url: "/auth/validate/email",
                method: "POST",
                body: { email },
            }),
        }),

        /* Kiểm tra Username tồn tại (Validate) */
        checkUsername: builder.mutation({
            query: (username) => ({
                url: "/auth/validate/username",
                method: "POST",
                body: { username },
            }),
        }),

        /* Quên mật khẩu  */
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),

        /* Validate Reset Token */
        validateResetToken: builder.query({
            query: (token) => ({
                url: "/auth/reset-password/validate",
                method: "GET",
                params: { token },
            }),
        }),

        /* Reset Password  */
        resetPassword: builder.mutation({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),

        /* Xác thực Email */
        verifyEmail: builder.mutation({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useForgotPasswordMutation,
    useMeQuery,
    useLazyMeQuery,
    useCheckEmailMutation,
    useCheckUsernameMutation,
    useValidateResetTokenQuery,
    useResetPasswordMutation,
    useRefreshTokenMutation,
    useVerifyEmailMutation,
} = authApi;
