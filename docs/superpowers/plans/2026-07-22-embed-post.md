# Embed Post (Task 9) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng UI & Logic cho trang Embed Post (`/:username/post/:postId/embed`), hiển thị bài viết Threads gọn nhẹ phù hợp nhúng Iframe, hỗ trợ responsive & dark/light mode.

**Architecture:** Tạo `EmbedLayout.jsx` độc lập không chứa Navbar/Sidebar/Footer/LoginPanel. Trang `Embed.jsx` fetch bài viết bằng RTK Query `useGetSinglePostQuery(postId)`. Component `EmbedPostCard.jsx` hiển thị chi tiết bài viết, watermark Threads và mở bài gốc trên tab mới khi tương tác.

**Tech Stack:** React 19, React Router v7, Redux Toolkit Query, Tailwind CSS v4, Lucide/Custom Icons.

## Global Constraints
- Đường dẫn alias: `@/`
- Component: `PascalCase.jsx`
- Styling: Tailwind CSS v4 với các class token `bg-threads-bg`, `text-threads-text`, `border-threads-border`
- Ngôn ngữ giao tiếp & comment log: 100% Tiếng Việt

---

### Task 1: Cấu hình Route & Đường dẫn trong `path.js` và `routes.js`

**Files:**
- Modify: `src/configs/path.js`
- Modify: `src/routes.js`
- Create: `src/layouts/EmbedLayout.jsx`
- Create: `src/pages/Embed.jsx`

**Interfaces:**
- Consumes: `paths` từ `@/configs/path`
- Produces: Route `/:username/post/:postId/embed` và `/@:username/post/:postId/embed` mapping tới `Embed.jsx` thông qua `EmbedLayout.jsx`

- [ ] **Step 1: Khai báo path trong `src/configs/path.js`**
Thêm `embed_post: "/:username/post/:postId/embed"` và `embed_post_with_at: "/@:username/post/:postId/embed"`.

- [ ] **Step 2: Tạo layout đơn giản `src/layouts/EmbedLayout.jsx`**
```jsx
import React from "react";
import { Outlet } from "react-router";

function EmbedLayout() {
    return (
        <div className="min-h-screen w-full bg-threads-bg text-threads-text flex items-center justify-center p-2 sm:p-4">
            <main className="w-full max-w-[540px]">
                <Outlet />
            </main>
        </div>
    );
}

export default EmbedLayout;
```

- [ ] **Step 3: Khai báo Route mới trong `src/routes.js`**
Thêm `EmbedLayout` vào danh sách routes, bọc `Embed` page lazy-loaded.

- [ ] **Step 4: Commit**
```bash
git add src/configs/path.js src/routes.js src/layouts/EmbedLayout.jsx
git commit -m "feat(embed): setup embed layout and routes"
```

---

### Task 2: Xây dựng Component `EmbedPostCard.jsx` & Trang `Embed.jsx`

**Files:**
- Create: `src/features/post/components/EmbedPostCard.jsx`
- Modify: `src/pages/Embed.jsx`

**Interfaces:**
- Consumes: `useGetSinglePostQuery` từ `@/services/post`
- Produces: Giao diện Embed Card hiển thị bài viết với đầy đủ thông tin + watermark "Xem trên Threads" mở tab mới.

- [ ] **Step 1: Tạo component `EmbedPostCard.jsx`**
Tạo component hiển thị bài viết nhúng chuyên biệt với thiết kế tương đương preview trong `EmbedModal.jsx`, có Logo Threads + Nút "Xem trên Threads" liên kết tới bài viết gốc `/:username/post/:postId` với `target="_blank"`.

- [ ] **Step 2: Hoàn thiện logic trong `src/pages/Embed.jsx`**
Đọc `postId` từ `useParams()`, gọi `useGetSinglePostQuery(postId)`, hiển thị loading spinner, thông báo lỗi nếu bài viết không tồn tại, hoặc render `EmbedPostCard`.

- [ ] **Step 3: Kiểm thử thủ công trên trình duyệt**
Truy cập URL thử nghiệm `/user/post/{postId}/embed` để verify layout không có Sidebar, hiển thị đúng card và mở tab mới khi click.

- [ ] **Step 4: Commit**
```bash
git add src/features/post/components/EmbedPostCard.jsx src/pages/Embed.jsx
git commit -m "feat(embed): implement EmbedPostCard and Embed page logic"
```
