# Thiết Kế Chi Tiết Thứ Tự Khối & Tương Tác Trong Post Detail (3 Yêu Cầu Mới)

## 1. Thứ Tự Hiển Thị Các Khối Trong Trang Post Detail
Theo đúng thứ tự chuẩn từ trên xuống:
1. **PostDetailHeader:** Header top bar (`<-- Thread ...`).
2. **Bài viết gốc (Main Post Card):** Hiển thị chi tiết bài viết gốc ở trên cùng (`disableNavigation={true}`).
3. **QuickReplyBar:** Thanh nhập reply nhanh ở giữa (`Trả lời [username]...`), nằm ngay phía dưới Bài viết gốc.
4. **Header phụ phân cách:** Thanh `↓↑ Mới đây` / `Xem hoạt động >`.
5. **Danh sách các bình luận (Replies List):** Render các comment kèm đường line nối dọc `hasThreadLine`.

## 2. Làm Sạch Các Đường Line Ngang Thừa (Line Clean-Up)
- `PostDetailHeader`: Giữ `border-b`.
- `Main Post`: Giữ `border-b` phân cách giữa bài viết gốc và thanh quick reply.
- `QuickReplyBar`: Bỏ class `border-b` thừa xung quanh.
- `Header phụ phân cách`: Giữ 1 đường `border-b` duy nhất bên dưới.
- `Replies`: Các bài viết có `hasThreadLine={true}` sẽ ẩn `border-b`.

## 3. Tương Tác 4 Nút Cho Bình Luận Con (Like, Reply, Repost, Share)
- Mở rộng hàm `updatePostCache` trong `src/services/post.js` để khi người dùng click Thả Tim (Like) hoặc Đăng lại (Repost) bất kỳ bài viết chính hay bình luận con nào:
  - Cập nhật tức thì (Optimistic Update) trên cả 3 loại cache query: `getFeed`, `getSinglePost`, và `getReplies`.
- Đảm bảo 4 nút tương tác (Like, Reply, Repost, Share) trên bình luận con hoạt động phản hồi lập tức và chuẩn xác.
