---
name: api-and-services
description: Standards for RTK Query APIs, baseQuery setup, Axios interceptors, token handling, and optimistic updates.
---

# API & Services (RTK Query & Axios)

## 1. Core Service Architecture

All API endpoints are defined using RTK Query `createApi` located in `src/services/`.

```
src/services/
├── httpRequest.js    # Axios instance with request/response & token refresh interceptors
├── baseQuery.js      # RTK Query custom baseQuery wrapper around httpRequest
├── auth.js           # Auth endpoints (login, register, me, refresh)
└── post.js           # Post endpoints (feed, create, like, repost)
```

## 2. Defining an Endpoint in RTK Query

```js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export const exampleApi = createApi({
    reducerPath: "exampleApi",
    baseQuery,
    tagTypes: ["Example"],
    endpoints: (builder) => ({
        getData: builder.query({
            query: (params) => ({
                url: "/example",
                method: "GET",
                params,
            }),
            providesTags: ["Example"],
        }),
        createData: builder.mutation({
            query: (body) => ({
                url: "/example",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Example"],
        }),
    }),
});

export const { useGetDataQuery, useCreateDataMutation } = exampleApi;
```

## 3. Optimistic Updates
For interactions like Like/Repost where instant UI update is required, use `onQueryStarted` and `updateQueryData`:

```js
likePost: builder.mutation({
    query: (id) => ({
        url: `/posts/${id}/like`,
        method: "POST",
    }),
    async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
            postApi.util.updateQueryData("getFeed", { type: "for_you" }, (draft) => {
                const post = draft.data?.find((p) => p.id === id);
                if (post) {
                    post.is_liked_by_auth = !post.is_liked_by_auth;
                    post.likes_count += post.is_liked_by_auth ? 1 : -1;
                }
            })
        );
        try {
            await queryFulfilled;
        } catch {
            patchResult.undo();
        }
    },
}),
```

## 4. Key Rules
- Register all new API slices in `src/store.js` (`reducer` and `middleware`).
- Always use `.unwrap()` when calling RTK Query mutations inside async try-catch blocks.
