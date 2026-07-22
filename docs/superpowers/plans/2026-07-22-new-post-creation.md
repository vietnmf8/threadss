# New Post Creation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện chức năng tạo bài viết mới (New Post / New Thread) từ `CreatePostDialog.jsx`, hỗ trợ gửi multi-thread, chọn quyền reply, đính kèm topic/media, và làm mới Home Feed sau khi đăng.

**Architecture:** 
1. `src/services/post.js`: Tích hợp RTK Query mutation `createPost` và `createReply` với invalidateTags / optimistic updates.
2. `src/features/post/components/CreatePostDialog.jsx`: Thêm `handleSubmitPost`, state `replyPermission`, tích hợp `DropdownMenu` chọn quyền reply, và gửi bài post đầu tiên (`POST /api/posts`) kèm các reply nối tiếp (`POST /api/posts/:id/reply`).
3. `src/layouts/DefaultLayout.jsx`: Gắn `<CreatePostDialog />` vào layout chung để mở được từ mọi vị trí (Header button, Sidebar button, PostInput trên Home).

**Tech Stack:** React 19, Redux Toolkit, Tailwind CSS v4, i18next, React Hot Toast.

## Global Constraints
- 100% Tiếng Việt trong giao tiếp.
- Code style: 4 spaces, double quotes, semicolons `;`.
- Pass `npm run build` và `npm run lint` 0 errors trên toàn bộ dự án (`eslint .`).

---

### Task 1: Nâng Cấp API Mutation `createPost` Trong `src/services/post.js`

**Files:**
- Modify: `src/services/post.js`

- [ ] **Step 1: Cập nhật `createPost` mutation hỗ trợ FormData và invalidateTags `Posts`**

```javascript
createPost: builder.mutation({
    query: (body) => ({
        url: END_POINT,
        method: "POST",
        body,
    }),
    invalidatesTags: [{ type: "Posts", id: "LIST" }],
}),
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/services/post.js
git commit -m "feat(services): update createPost mutation tags and query options"
```

---

### Task 2: Hoàn Thiện Logic Soạn Thảo & Đăng Bài Trong `CreatePostDialog.jsx`

**Files:**
- Modify: `src/features/post/components/CreatePostDialog.jsx`

- [ ] **Step 1: Thêm state `replyPermission` và helper `getPermissionLabel`**
- [ ] **Step 2: Viết `handleSubmitPost`**

```javascript
const handleSubmitPost = async () => {
    if (!canPost || isSubmitting) return;

    try {
        let parentPostId = null;

        for (let i = 0; i < threads.length; i++) {
            const currentThread = threads[i];
            if (currentThread.content.trim()) {
                const formData = new FormData();
                formData.append("content", currentThread.content);
                formData.append("reply_permission", replyPermission);
                if (i === 0 && topic.trim()) {
                    formData.append("topic_name", topic.trim());
                    formData.append("topic", topic.trim());
                }

                if (i === 0 && !isQuoteMode) {
                    const response = await createPost(formData).unwrap();
                    parentPostId = response?.data?.id || response?.id;
                } else if (i === 0 && isQuoteMode) {
                    formData.append("original_post_id", quotedPost.id);
                    const response = await createPost(formData).unwrap();
                    parentPostId = response?.data?.id || response?.id;
                } else {
                    const response = await createReply({
                        id: parentPostId,
                        body: formData,
                        topicName: topic.trim(),
                    }).unwrap();
                    const createdReplyId = response?.data?.id || response?.id;
                    if (createdReplyId) parentPostId = createdReplyId;
                }
            }
        }

        toast.success(t("home:post_created_success") || "Đã đăng bài thành công!");
        handleFinalClose();
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        toast.error(error?.data?.message || t("home:post_failed") || "Đăng bài thất bại");
    }
};
```

- [ ] **Step 3: Gắn `onClick={handleSubmitPost}` cho Button "Đăng" và DropdownMenu cho "Reply options"**
- [ ] **Step 4: Commit Task 2**

```bash
git add src/features/post/components/CreatePostDialog.jsx
git commit -m "feat(post): implement handleSubmitPost and reply permission dropdown in CreatePostDialog"
```

---

### Task 3: Chạy Verification toàn diện (`npm run build`, `npm run lint` 0 errors, JS script)

- [ ] **Step 1: Chạy `test-reply-logic.js`**
- [ ] **Step 2: Chạy `npm run build`**
- [ ] **Step 3: Chạy `npm run lint` toàn bộ dự án (`eslint .`)**
- [ ] **Step 4: Commit và hoàn tất**
