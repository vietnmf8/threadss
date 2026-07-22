import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice quản lý trạng thái soạn thảo bài viết
 */
const postSlice = createSlice({
    name: "post",
    initialState: {
        // Trạng thái đóng/mở Composer
        isDialogOpen: false,
        // Dữ liệu bài viết gốc khi thực hiện Quote (Trích dẫn)
        quotedPost: null,
        // Trạng thái đóng/mở Reply Modal
        isReplyDialogOpen: false,
        // Dữ liệu bài viết gốc đang được phản hồi (Reply)
        replyTargetPost: null,
    },
    reducers: {
        /**
         * Mở Dialog soạn thảo
         * @param {Object} action.payload - Object chứa thông tin bài viết được trích dẫn
         */
        openPostDialog: (state, action) => {
            state.isDialogOpen = true;
            state.quotedPost = action.payload || null;
        },
        /**
         * Đóng Dialog và dọn dẹp dữ liệu thừa
         */
        closePostDialog: (state) => {
            state.isDialogOpen = false;
            state.quotedPost = null;
        },
        /**
         * Mở Reply Modal
         * @param {Object} action.payload - Object chứa thông tin bài viết được reply
         */
        openReplyDialog: (state, action) => {
            state.isReplyDialogOpen = true;
            state.replyTargetPost = action.payload || null;
        },
        /**
         * Đóng Reply Modal và dọn dẹp dữ liệu bài viết gốc
         */
        closeReplyDialog: (state) => {
            state.isReplyDialogOpen = false;
            state.replyTargetPost = null;
        },
    },
});

export const {
    openPostDialog,
    closePostDialog,
    openReplyDialog,
    closeReplyDialog,
} = postSlice.actions;
export default postSlice.reducer;
