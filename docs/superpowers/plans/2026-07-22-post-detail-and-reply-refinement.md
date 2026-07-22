# Post Detail Layout Order & 4 Action Interactions Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đảo thứ tự bài viết gốc lên trước QuickReplyBar, làm sạch các đường border ngang thừa, và hỗ trợ Optimistic Updates cho 4 nút tương tác (Like, Reply, Repost, Share) trên bình luận con.

**Architecture:** 
1. `src/services/post.js`: Nâng cấp `onQueryStarted` của `likePost` và `repostPost` để cập nhật đồng thời 3 cache: `getFeed`, `getSinglePost`, và `getReplies`.
2. `src/pages/PostDetail/components/QuickReplyBar.jsx`: Bỏ `border-b` trùng lặp.
3. `src/pages/PostDetail/index.jsx`: Thay đổi thứ tự các phần tử: Header -> Main Post -> QuickReplyBar -> Sort Header -> Replies.

**Tech Stack:** React 19, Redux Toolkit (RTK Query), Tailwind CSS v4, i18next.

## Global Constraints
- 100% Tiếng Việt trong giao tiếp.
- Code style: 4 spaces, double quotes, semicolons `;`.
- Pass `npm run build` và `npm run lint` 0 errors trên toàn bộ dự án (`eslint .`).

---

### Task 1: Nâng Cấp Optimistic Cache Updates Trong `src/services/post.js` Cho `getReplies` & `getSinglePost`

**Files:**
- Modify: `src/services/post.js`

- [ ] **Step 1: Cập nhật helper `updatePostCache` và `onQueryStarted` trong `src/services/post.js`**

Cho phép cập nhật cache cả ở dạng mảng `getFeed` / `getReplies` và ở dạng object đơn `getSinglePost`.

- [ ] **Step 2: Commit Task 1**

```bash
git add src/services/post.js
git commit -m "feat(services): support optimistic cache updates for getSinglePost and getReplies"
```

---

### Task 2: Đảo Thứ Tự Layout & Xóa Border Thừa Trong `PostDetail/index.jsx` & `QuickReplyBar.jsx`

**Files:**
- Modify: `src/pages/PostDetail/components/QuickReplyBar.jsx`
- Modify: `src/pages/PostDetail/index.jsx`

- [ ] **Step 1: Bỏ border thừa trong `QuickReplyBar.jsx`**

- [ ] **Step 2: Cập nhật thứ tự JSX trong `PostDetail/index.jsx`**
  1. `<PostDetailHeader />`
  2. `<PostCard post={post} disableNavigation={true} />` (Bài viết gốc)
  3. `<QuickReplyBar post={post} />` (ReplyBar ở giữa)
  4. Thanh tiêu đề "Mới đây / Xem hoạt động"
  5. Danh sách bình luận

- [ ] **Step 3: Commit Task 2**

```bash
git add src/pages/PostDetail/components/QuickReplyBar.jsx src/pages/PostDetail/index.jsx
git commit -m "feat(page): reorder PostDetail layout components and clean up borders"
```

---

### Task 3: Chạy Quy Trình Verification Toàn Diện

- [ ] **Step 1: Chạy `test-reply-logic.js`**
- [ ] **Step 2: Chạy `npm run build`**
- [ ] **Step 3: Chạy `npm run lint` toàn bộ dự án (`eslint .`)**
