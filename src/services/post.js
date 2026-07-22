import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

const END_POINT = "/posts";

/* Cập nhật cache Optimistic cho Post (Like/Repost) */
const updatePostCache = (draft, id, field, countField) => {
    const post = draft.data?.find((p) => p.id === id);
    if (post) {
        const isCurrentActive = post[field];
        post[field] = !isCurrentActive;
        // Cập nhật số lượng (+1/-1)
        if (countField) {
            post[countField] += isCurrentActive ? -1 : 1;
        }
    }
};

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery,
    tagTypes: ["Posts"],

    endpoints: (builder) => ({
        /* GET: Lấy danh sách bài viết (Feed) */
        getFeed: builder.query({
            query: ({ type, page = 1 }) => ({
                url: `${END_POINT}/feed`,
                method: "GET",
                params: { type, page },
                fullResponse: true,
            }),

            // Chỉ cache theo type
            serializeQueryArgs: ({ queryArgs }) => {
                return { type: queryArgs.type };
            },

            // Gộp dữ liệu từ các page
            merge: (currentCache, newResponse, { arg }) => {
                if (arg.page === 1) {
                    return newResponse;
                }
                // Gộp data từ page mới vào cache hiện tại
                const existingIds = new Set(
                    currentCache.data?.map((p) => p.id) || [],
                );
                const newItems =
                    newResponse.data?.filter((p) => !existingIds.has(p.id)) ||
                    [];

                return {
                    ...newResponse,
                    data: [...(currentCache.data || []), ...newItems],
                };
            },

            // Force refetch khi page thay đổi
            forceRefetch: ({ currentArg, previousArg }) => {
                return (
                    currentArg?.page > 1 &&
                    currentArg?.page !== previousArg?.page
                );
            },

            providesTags: (result) => {
                const posts = result?.data || [];
                return posts.length > 0
                    ? [
                          ...posts.map(({ id }) => ({
                              type: "Posts",
                              id,
                          })),
                          { type: "Posts", id: "LIST" },
                      ]
                    : [{ type: "Posts", id: "LIST" }];
            },
        }),

        /* POST: Tạo bài viết mới */
        createPost: builder.mutation({
            query: (body) => ({
                url: END_POINT,
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Posts", id: "LIST" }],
        }),

        /* POST: Thả like/Bỏ like bài viết */
        likePost: builder.mutation({
            query: (id) => ({
                url: `${END_POINT}/${id}/like`,
                method: "POST",
            }),
            // Optimistic Update
            async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
                // Tìm trong cache của getFeed xem có bài viết nào khớp ID không để cập nhật ngay lập tức UI
                const patchResults = [];

                // Lấy tất cả cache keys hiện có của getFeed
                const queries = getState().postApi.queries;

                Object.keys(queries).forEach((key) => {
                    if (key.startsWith("getFeed")) {
                        const patchResult = dispatch(
                            postApi.util.updateQueryData(
                                "getFeed",
                                queries[key].originalArgs,
                                (draft) => {
                                    updatePostCache(
                                        draft,
                                        id,
                                        "is_liked_by_auth",
                                        "likes_count",
                                    );
                                },
                            ),
                        );
                        patchResults.push(patchResult);
                    }
                });

                try {
                    await queryFulfilled;
                } catch {
                    // Rollback nếu API lỗi
                    patchResults.forEach((patch) => patch.undo());
                }
            },
        }),

        /* POST: Repost/Bỏ Repost bài viết */
        repostPost: builder.mutation({
            query: (id) => ({
                url: `${END_POINT}/${id}/repost`,
                method: "POST",
                body: {},
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
                const patchResults = [];
                const queries = getState().postApi.queries;

                Object.keys(queries).forEach((key) => {
                    if (key.startsWith("getFeed")) {
                        const patchResult = dispatch(
                            postApi.util.updateQueryData(
                                "getFeed",
                                queries[key].originalArgs,
                                (draft) => {
                                    updatePostCache(
                                        draft,
                                        id,
                                        "is_reposted_by_auth",
                                        "reposts_and_quotes_count",
                                    );
                                },
                            ),
                        );
                        patchResults.push(patchResult);
                    }
                });

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((patch) => patch.undo());
                }
            },
        }),
    }),
});

export const {
    useGetFeedQuery,
    useCreatePostMutation,
    useLikePostMutation,
    useRepostPostMutation,
} = postApi;
