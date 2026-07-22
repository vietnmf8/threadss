import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

const END_POINT = "/posts";

/* Cập nhật cache Optimistic cho Post (Like/Repost) */
const updatePostCache = (draft, id, field, countField) => {
    if (!draft) return;

    // Trường hợp 1: draft chứa danh sách bài viết (Feed hoặc Replies)
    const postList = Array.isArray(draft.data)
        ? draft.data
        : Array.isArray(draft)
          ? draft
          : null;

    if (postList) {
        const post = postList.find((p) => String(p?.id) === String(id));
        if (post) {
            const isCurrentActive = post[field];
            post[field] = !isCurrentActive;
            if (countField && typeof post[countField] === "number") {
                post[countField] += isCurrentActive ? -1 : 1;
            }
        }
        return;
    }

    // Trường hợp 2: draft chứa 1 bài viết đơn (Single Post)
    const singlePost = draft.data || draft;
    if (singlePost && String(singlePost.id) === String(id)) {
        const isCurrentActive = singlePost[field];
        singlePost[field] = !isCurrentActive;
        if (countField && typeof singlePost[countField] === "number") {
            singlePost[countField] += isCurrentActive ? -1 : 1;
        }
    }
};

/* Helper kích hoạt Optimistic Update cho toàn bộ cache queries */
const applyOptimisticUpdate = (id, field, countField, getState, dispatch) => {
    const patchResults = [];
    const queries = getState().postApi.queries;

    Object.keys(queries).forEach((key) => {
        let endpointName = null;
        if (key.startsWith("getFeed")) endpointName = "getFeed";
        else if (key.startsWith("getSinglePost")) endpointName = "getSinglePost";
        else if (key.startsWith("getReplies")) endpointName = "getReplies";

        if (endpointName) {
            const patchResult = dispatch(
                postApi.util.updateQueryData(
                    endpointName,
                    queries[key].originalArgs,
                    (draft) => {
                        updatePostCache(draft, id, field, countField);
                    },
                ),
            );
            patchResults.push(patchResult);
        }
    });

    return patchResults;
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
                const patchResults = applyOptimisticUpdate(
                    id,
                    "is_liked_by_auth",
                    "likes_count",
                    getState,
                    dispatch,
                );

                try {
                    await queryFulfilled;
                } catch {
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
                const patchResults = applyOptimisticUpdate(
                    id,
                    "is_reposted_by_auth",
                    "reposts_and_quotes_count",
                    getState,
                    dispatch,
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResults.forEach((patch) => patch.undo());
                }
            },
        }),
        /* POST: Tạo phản hồi (Reply) bài viết */
        createReply: builder.mutation({
            query: ({ id, body }) => ({
                url: `${END_POINT}/${id}/reply`,
                method: "POST",
                body,
            }),
            async onQueryStarted({ id, topicName }, { dispatch, queryFulfilled }) {
                try {
                    const { data: response } = await queryFulfilled;
                    const createdReply = response?.data || response;

                    if (createdReply?.id && topicName) {
                        try {
                            localStorage.setItem(`reply_topic_${createdReply.id}`, topicName);
                        } catch {
                            // localStorage error ignore
                        }

                        dispatch(
                            postApi.util.updateQueryData(
                                "getReplies",
                                { id },
                                (draft) => {
                                    const list = Array.isArray(draft?.data)
                                        ? draft.data
                                        : Array.isArray(draft)
                                          ? draft
                                          : null;
                                    if (list) {
                                        const item = list.find(
                                            (r) => String(r.id) === String(createdReply.id),
                                        );
                                        if (item) {
                                            item.topic_name = topicName;
                                        }
                                    }
                                },
                            ),
                        );
                    }
                } catch {
                    // Ignore query fail
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Posts", id },
                { type: "Posts", id: "LIST" },
            ],
        }),

        /* GET: Lấy thông tin 1 bài viết chi tiết */
        getSinglePost: builder.query({
            query: (id) => ({
                url: `${END_POINT}/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Posts", id }],
        }),

        /* GET: Lấy danh sách phản hồi của bài viết */
        getReplies: builder.query({
            query: ({ id, page = 1 }) => ({
                url: `${END_POINT}/${id}/replies`,
                method: "GET",
                params: { page },
            }),
            providesTags: (result, error, { id }) => [
                { type: "Posts", id: `REPLIES_${id}` },
            ],
        }),
    }),
});

export const {
    useGetFeedQuery,
    useGetSinglePostQuery,
    useCreatePostMutation,
    useLikePostMutation,
    useRepostPostMutation,
    useCreateReplyMutation,
    useGetRepliesQuery,
} = postApi;

