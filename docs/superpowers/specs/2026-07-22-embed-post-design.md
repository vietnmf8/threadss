# Thiết kế Kỹ thuật Trang Embed Post (Task 9)

**Ngày tạo:** 2026-07-22  
**Trạng thái:** Đang xem xét  

## 1. Tổng quan (Overview)
Trang Embed Post (`/src/pages/Embed.jsx`) cho phép nhúng một bài viết Threads đơn lẻ vào các trang web bên ngoài thông qua thẻ `<iframe>`. Trang này hiển thị gọn nhẹ, không có Sidebar, Header, Footer hay LoginPanel, tối ưu responsive và hỗ trợ cả giao diện Sáng/Tối (Light/Dark mode) theo theme hệ thống.

---

## 2. Đường dẫn & Định tuyến (Routes & Path Config)

### Cấu hình Route
- Thêm đường dẫn vào `src/configs/path.js`:
  - `embed_post: "/:username/post/:postId/embed"`
  - `embed_post_with_at: "/@:username/post/:postId/embed"` (hoặc tự động bóc tách dấu `@` từ param `username`).

- Thêm route vào `src/routes.js`:
  - Sử dụng layout riêng `EmbedLayout` (không dùng `DefaultLayout` hay `AuthLayout`).

---

## 3. Kiến trúc Component (Architecture & Layout)

### A. `src/layouts/EmbedLayout.jsx`
- Layout độc lập, siêu nhẹ.
- Render duy nhất container chính chứa `<Outlet />` hoặc `{children}`.
- Không chứa Navbar, Sidebar, Footer, Splash Screen hay LoginPanel.
- Hỗ trợ background thích ứng theo theme: `bg-threads-bg text-threads-text`.

### B. `src/pages/Embed.jsx`
- Lấy `postId` từ `useParams()`.
- Sử dụng RTK Query `useGetSinglePostQuery(postId)` từ `src/services/post.js`.
- Xử lý các trạng thái:
  - **Loading:** Hiển thị Spinner căn giữa bài viết.
  - **Error / Not Found:** Hiển thị thông báo "Bài viết không tồn tại hoặc đã bị xóa" đi kèm logo Threads.
  - **Success:** Render component `EmbedPostCard` (hoặc `PostCard` dạng embed).

### C. `src/features/post/components/EmbedPostCard.jsx`
- Thẻ hiển thị bài viết được thiết kế chuyên biệt cho Iframe nhúng:
  - **Header:** Avatar, Tên người dùng, Username, Icon Tích xanh (nếu verified), Thời gian đăng.
  - **Body:** Nội dung văn bản (`post.content`), hình ảnh/media đính kèm (`post.media_urls`).
  - **Interaction Bar (Tương tác):** Hiển thị số lượng Like, Reply, Repost (chỉ xem, click vào sẽ mở tab mới).
  - **Footer Watermark:** Logo Threads + Text "Threads" + Nút/Link "Xem trên Threads" (View on Threads).
- **Hành vi tương tác:**
  - Click vào bất kỳ phần tử nào trên thẻ (hoặc nút "Xem trên Threads") đều điều hướng mở bài gốc `/:username/post/:postId` ở tab mới (`target="_blank"` và `rel="noopener noreferrer"`).

---

## 4. Tối ưu Responsive & Iframe

- Thẻ embed có đường viền `border border-threads-border rounded-2xl p-4 shadow-sm`.
- Đảm bảo font-size và media tự động co giãn theo width của Iframe (`w-full h-auto`).
- `overflow-hidden` để tránh vỡ khung khi nhúng vào khung iframe nhỏ.

---

## 5. Kế hoạch Kiểm thử (Verification Plan)
- **Kiểm thử Route:** Truy cập trực tiếp cả 2 URL `/@admin/post/123/embed` và `/admin/post/123/embed`.
- **Kiểm thử Layout:** Xác nhận không hiển thị Sidebar/Footer/Header.
- **Kiểm thử Iframe Integration:** Tạo file HTML test nhúng `<iframe>` để kiểm tra độ nhạy responsive và mở tab mới khi click.
