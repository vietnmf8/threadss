# Reply Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng Reply Modal đầy đủ UI & Logic theo mục ##8 trong `docs/task-checklist.md`, cho phép phản hồi một bài viết cụ thể, hiển thị Target Post Card ở trên cùng kèm đường nối thread line, hỗ trợ chọn media, GIF, emoji, add topic, add to thread và gọi API RTK Query `POST /api/posts/:id/reply`.

**Architecture:** 
Tạo `TargetPostHeader.jsx` hiển thị bài viết gốc, tạo `ReplyModal.jsx` kế thừa thiết kế của `CreatePostDialog.jsx` và các sub-components (`CreatePostInput`, `useThreadComposer`). Bổ sung `createReply` mutation vào RTK Query `postApi` (`src/services/post.js`), quản lý trạng thái Reply Modal trong Redux `postSlice.js`.

**Tech Stack:** React 19, Redux Toolkit (RTK Query), Tailwind CSS v4, i18next, Shadcn UI (`Dialog`).

## Global Constraints
- Sử dụng 100% Tiếng Việt trong giao tiếp với user.
- 4 spaces indentation, double quotes, semicolons `;`.
- Dùng alias `@/` cho `src/`.
- Tiêu chuẩn hiệu năng: event `stopPropagation` cho các nút bấm, CLS = 0.
- Pass `npm run build` và `npm run lint` 0 errors trên toàn bộ dự án (`eslint .`).

---

### Task 1: Mở rộng RTK Query Service (`src/services/post.js`) và Redux Slice (`src/features/post/postSlice.js`)

**Files:**
- Modify: `src/services/post.js`
- Modify: `src/features/post/postSlice.js`

**Interfaces:**
- Consumes: `baseQuery`, `createApi`
- Produces: `useCreateReplyMutation`, `openReplyDialog`, `closeReplyDialog`

- [ ] **Step 1: Bổ sung mutation `createReply` vào `src/services/post.js`**

```javascript
// Thêm endpoint createReply:
createReply: builder.mutation({
    query: ({ id, body }) => ({
        url: `${END_POINT}/${id}/reply`,
        method: "POST",
        body,
    }),
    invalidatesTags: (result, error, { id }) => [
        { type: "Posts", id },
        { type: "Posts", id: "LIST" },
    ],
}),
```

- [ ] **Step 2: Export `useCreateReplyMutation` trong `src/services/post.js`**

- [ ] **Step 3: Bổ sung state & reducers vào `src/features/post/postSlice.js`**

```javascript
initialState: {
    isDialogOpen: false,
    quotedPost: null,
    isReplyDialogOpen: false,
    replyTargetPost: null,
},
reducers: {
    openReplyDialog: (state, action) => {
        state.isReplyDialogOpen = true;
        state.replyTargetPost = action.payload || null;
    },
    closeReplyDialog: (state) => {
        state.isReplyDialogOpen = false;
        state.replyTargetPost = null;
    },
}
```

- [ ] **Step 4: Commit thay đổi state & API**

```bash
git add src/services/post.js src/features/post/postSlice.js
git commit -m "feat(post): add createReply mutation and reply dialog state"
```

---

### Task 2: Tạo Component `TargetPostHeader.jsx`

**Files:**
- Create: `src/features/post/components/TargetPostHeader.jsx`

**Interfaces:**
- Consumes: `post` object (Target post model)
- Produces: UI header hiển thị avatar, username, timestamp, content, media của post gốc và đường thread line nối xuống bên dưới.

- [ ] **Step 1: Viết `TargetPostHeader.jsx`**

Tạo component `TargetPostHeader` nhận prop `post`, render thông tin tác giả, thời gian tạo, nội dung bài viết gốc, hiển thị ảnh/video (nếu có) và hiển thị cột avatar có đường kẻ dọc `bg-threads-border` nối xuống avatar của người phản hồi.

- [ ] **Step 2: Commit `TargetPostHeader.jsx`**

```bash
git add src/features/post/components/TargetPostHeader.jsx
git commit -m "feat(post): create TargetPostHeader component for Reply Modal"
```

---

### Task 3: Tạo Component `ReplyModal.jsx` & Re-export

**Files:**
- Create: `src/features/post/components/ReplyModal.jsx`
- Create: `src/components/post/ReplyModal.jsx`

**Interfaces:**
- Consumes: Redux `isReplyDialogOpen`, `replyTargetPost`, custom hook `useThreadComposer`, RTK Query `useCreateReplyMutation`, `useCreatePostMutation`
- Produces: Modal soạn thảo phản hồi hoàn chỉnh.

- [ ] **Step 1: Viết `src/features/post/components/ReplyModal.jsx`**

Sử dụng Shadcn `Dialog`, tích hợp `TargetPostHeader` ở trên cùng, map các `threads` từ `useThreadComposer`, hiển thị placeholder dạng `Trả lời [username]...`, toolbar 5 nút hành động (Media, GIF, Emoji, Poll, Location), link "Add topic", "Add to thread", footer với nút "Reply options" và "Post".

- [ ] **Step 2: Tạo `src/components/post/ReplyModal.jsx` re-export**

```javascript
import ReplyModal from "@/features/post/components/ReplyModal";
export default ReplyModal;
```

- [ ] **Step 3: Commit `ReplyModal.jsx`**

```bash
git add src/features/post/components/ReplyModal.jsx src/components/post/ReplyModal.jsx
git commit -m "feat(post): create ReplyModal component and re-export"
```

---

### Task 4: Kết nối Reply Icon trên `PostActions.jsx` & Tích hợp Modal tại Layout/Feed Page

**Files:**
- Modify: `src/features/post/hooks/usePostActions.js`
- Modify: `src/pages/Home/index.jsx` (hoặc Layout chính hiển thị Post Dialogs)

**Interfaces:**
- Consumes: `openReplyDialog` action từ Redux
- Produces: Khi click nút Reply Icon trên PostCard -> mở `ReplyModal`.

- [ ] **Step 1: Cập nhật `handleReply` trong `usePostActions.js`**

```javascript
const handleReply = useCallback(() => {
    if (props.post) {
        dispatch(openReplyDialog(props.post));
    }
}, [dispatch, props.post]);
```

- [ ] **Step 2: Khai báo `<ReplyModal />` tại trang/layout thích hợp**

- [ ] **Step 3: Cập nhật `docs/task-checklist.md` đánh dấu tích `[x]` cho mục ##8**

- [ ] **Step 4: Chạy quy trình xác minh theo `@.agents/skills/verification` (`npm run build`, `npm run lint`, cURL test)**

- [ ] **Step 5: Commit kết quả**

```bash
git add .
git commit -m "feat(post): integrate ReplyModal into PostActions and home page"
```
