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
    },
});

export const { openPostDialog, closePostDialog } = postSlice.actions;
export default postSlice.reducer;
