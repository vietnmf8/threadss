import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

const END_POINT = "/products";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery,
    // Định nghĩa Tag để quản lý cache
    tagTypes: ["Products"],

    endpoints: (builder) => ({
        /* GET: Lấy danh sách products */
        getProducts: builder.query({
            // Các tham số params: Nhận đối số khi gọi customHook
            query: (params) => ({
                url: END_POINT,
                method: "GET",
                params: params,
            }),
            // Dán nhãn Tag để nhận biết dữ liệu này được Cache
            providesTags: ["Products"],
        }),

        /* POST: Tạo mới product */
        createProduct: builder.mutation({
            query: (body) => ({
                url: END_POINT,
                method: "POST",
                body,
            }),
            // Báo hiệu để re-fetch lại danh sách products
            invalidatesTags: ["Products"],
        }),

        /* PATCH: Cập nhật sản phẩm */
        updateProduct: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `${END_POINT}/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Products"],
        }),

        /* DELETE: Xoá */
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `${END_POINT}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
