# Edit & Delete Post & Comment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hoàn thiện chức năng Chỉnh sửa (Edit) và Xóa (Delete) cho cả bài viết gốc (Post) và bình luận (Comment/Reply), đồng thời chuẩn hóa nhãn từ "Bài viết" sang "Bình luận" ở phần comment.

**Architecture:** 
1. `src/services/post.js`: Tích hợp 2 mutation RTK Query `updatePost` (`POST /api/posts/:id` với `_method: "PUT"`) và `deletePost` (`POST /api/posts/:id` với `_method: "DELETE"`), có cache invalidation và updateQueryData.
2. `src/features/post/components/EditPostModal.jsx`: Tạo mới Dialog chỉnh sửa bài viết/bình luận, tiêu đề tự động đổi ("Chỉnh sửa bài viết" / "Chỉnh sửa bình luận").
3. `src/features/post/hooks/usePostMoreMenu.js` & `PostMoreMenu.jsx`: Phân biệt `isComment` (dựa trên `post.parent_id`), hiển thị đúng menu label ("Chỉnh sửa bình luận", "Xóa bình luận"), gọi `deletePost` thực tế và mở `EditPostModal`.

**Tech Stack:** React 19, Redux Toolkit, Tailwind CSS v4, i18next, React Hot Toast.

## Global Constraints
- 100% Tiếng Việt trong giao tiếp.
- Code style: 4 spaces, double quotes, semicolons `;`.
- Pass `npm run build` và `npm run lint` 0 errors trên toàn bộ dự án (`eslint .`).

---

### Task 1: Thêm API Mutations `updatePost` và `deletePost` Trong `src/services/post.js`

**Files:**
- Modify: `src/services/post.js`

- [ ] **Step 1: Viết `updatePost` mutation và `deletePost` mutation**

```javascript
/* POST: Chỉnh sửa bài viết/bình luận */
updatePost: builder.mutation({
    query: ({ id, body }) => ({
        url: `${END_POINT}/${id}`,
        method: "POST",
        body,
    }),
    invalidatesTags: (result, error, { id }) => [
        { type: "Posts", id },
        { type: "Posts", id: "LIST" },
    ],
}),

/* POST: Xóa bài viết/bình luận */
deletePost: builder.mutation({
    query: (id) => ({
        url: `${END_POINT}/${id}`,
        method: "POST",
        body: { _method: "DELETE" },
    }),
    invalidatesTags: (result, error, id) => [
        { type: "Posts", id },
        { type: "Posts", id: "LIST" },
    ],
}),
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/services/post.js
git commit -m "feat(services): add updatePost and deletePost mutations"
```

---

### Task 2: Tạo Component `EditPostModal.jsx` Cho Việc Chỉnh Sửa Bài Viết & Bình Luận

**Files:**
- Create: `src/features/post/components/EditPostModal.jsx`

- [ ] **Step 1: Xây dựng Modal Dialog `EditPostModal.jsx`**
  - Props: `isOpen`, `onOpenChange`, `post`.
  - Distinguish `isComment = !!post?.parent_id`.
  - Title: `isComment ? "Chỉnh sửa bình luận" : "Chỉnh sửa bài viết"`.
  - Form: `content`, `topic_name` (nếu có), button "Lưu" gọi `updatePost`.

- [ ] **Step 2: Commit Task 2**

```bash
git add src/features/post/components/EditPostModal.jsx
git commit -m "feat(post): create EditPostModal component for posts and comments"
```

---

### Task 3: Kết Nối `usePostMoreMenu.js` & `PostMoreMenu.jsx` Cho Phép Xóa & Sửa Thực Tế Vừa Chuẩn Hóa Nhãn "Bình Luận"

**Files:**
- Modify: `src/features/post/hooks/usePostMoreMenu.js`
- Modify: `src/features/post/components/PostMoreMenu.jsx`

- [ ] **Step 1: Phân biệt `isComment` và gọi `deletePost` thực tế trong `handleOpenDeleteConfirm`**
- [ ] **Step 2: Chuẩn hóa nhãn "Bài viết" -> "Bình luận" khi `isComment` = true**
- [ ] **Step 3: Mở `EditPostModal` khi người dùng bấm "Chỉnh sửa bài viết/bình luận"**

- [ ] **Step 4: Commit Task 3**

```bash
git add src/features/post/hooks/usePostMoreMenu.js src/features/post/components/PostMoreMenu.jsx
git commit -m "feat(post): wire up actual delete and edit actions in PostMoreMenu with dynamic isComment labels"
```

---

### Task 4: Automated Testing & Build Verification

- [ ] **Step 1: Chạy `npm run build`**
- [ ] **Step 2: Chạy `npm run lint` toàn bộ dự án (`eslint .`)**
- [ ] **Step 3: Commit và hoàn tất**
