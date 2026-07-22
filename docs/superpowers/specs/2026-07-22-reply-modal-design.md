# Thiết Kế Chi Tiết Tính Năng Reply Modal (Mục ##8 Task Checklist)

## 1. Tổng Quan Yêu Cầu & So Sánh UI Với New Post Modal
Reply Modal phục vụ việc phản hồi một bài viết cụ thể trên F8 Threads.
Dựa trên rà soát thiết kế UI thực tế (ảnh đính kèm) và mục ##8 trong `docs/task-checklist.md`:

### Điểm Tương Đồng Với New Post Dialog (`CreatePostDialog.jsx`):
- Thừa hưởng layout Dialog 2 tầng (Responsive: Bottom sheet trên mobile, Centered dialog 620px trên desktop).
- Header 3 cột (Nút "Hủy", Tiêu đề "Câu trả lời" / "Reply", Nút "...").
- Thân Modal sử dụng Multi-thread composer (hỗ trợ "Add to thread").
- Toolbar icons bên dưới textarea: Upload Ảnh/Video, GIF, Emoji, Poll/Survey, Location, Audio.
- Nút chọn chủ đề ("Add a topic").
- Footer: Nút "Reply options" (Lựa chọn về bài viết) bên trái và Nút "Post" (Đăng) bên phải.
- Confirm Dialog khi hủy bỏ nếu có nội dung thay đổi.

### Điểm Khác Biệt Cần Bổ Sung/Tùy Biến Cho Reply Modal:
1. **Target Post Card (Bài viết được phản hồi):** Vị trí trên cùng của Modal hiển thị thông tin bài viết gốc (Avatar, Username, Timestamp, Content, Media).
2. **Đường Chỉ Dọc (Thread line):** Nối từ Avatar bài viết gốc xuống Avatar của người trả lời.
3. **Placeholder Đặt Theo Username:** Placeholder ô nhập nội dung hiển thị dạng `Trả lời [username_bài_gốc]...` (ví dụ: `Trả lời _marco.axl.rose_...`).
4. **API Integration & Event Handling:**
   - Khi bấm Post: Bài viết đầu tiên gửi qua API `POST /api/posts/:id/reply` với `:id` là ID bài viết gốc (FormData).
   - Nếu user chọn "Add to thread" thêm các bài tiếp theo: Các bài sau sẽ tạo qua API `POST /api/posts`.
   - Đóng modal và refresh/invalidate cache danh sách phản hồi/feed sau khi đăng thành công.

---

## 2. API Documentation Checklist
Đã kiểm tra đối chiếu với `docs/api-documentation.md`:
- **Create Reply Endpoint (API #24):**
  - **Method:** `POST`
  - **Endpoint:** `/api/posts/:id/reply`
  - **Auth:** `Bearer Token`
  - **Content-Type:** `multipart/form-data`
  - **Body Payload:** `content`, `media[]`, `reply_permission`
- **Get Replies Endpoint (API #22):**
  - **Method:** `GET`
  - **Endpoint:** `/api/posts/:id/replies`

API backend đã có sẵn và sẵn sàng sử dụng.

---

## 3. Kiến Trúc Mã Nguồn & Cấu Trúc File
- `src/features/post/components/TargetPostHeader.jsx`: Component hiển thị thông tin bài viết gốc ở đầu Reply Modal kèm đường line nối xuống avatar reply.
- `src/features/post/components/ReplyModal.jsx`: Component Modal chính quản lý Reply.
- `src/components/post/ReplyModal.jsx`: File re-export để thỏa mãn quy chuẩn checklist ##8.
- `src/services/post.js`: Thêm mutation `createReply` (`POST /api/posts/:id/reply`) và invalidatesTags.
- `src/features/post/postSlice.js`: Thêm state `isReplyDialogOpen` và `replyTargetPost`, cùng reducers `openReplyDialog` và `closeReplyDialog`.
- `src/features/post/hooks/usePostActions.js`: Gắn callback khi bấm nút Reply icon để dispatch `openReplyDialog(post)`.
