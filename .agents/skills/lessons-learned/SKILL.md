---
name: lessons-learned
description: Thư viện bài học kinh nghiệm & phòng tránh tái phạm lỗi: Tổng hợp các nguyên nhân gây lỗi thực tế và giải pháp chuẩn hóa cho dự án Threads Clone.
---

# Lessons Learned & Bug Prevention Skill (Học Tập Kinh Nghiệm & Phòng Tránh Lỗi)

Tài liệu tích lũy bài học kinh nghiệm thực tế từ các lỗi phát sinh trong quá trình lập trình dự án **Threads Clone**. Mọi đóng góp code mới hoặc sửa lỗi trong tương lai BẮT BUỘC phải đọc và đối chiếu skill này để tránh tái phạm.

---

## Danh Sách Bài Học & Kinh Nghiệm Tích Lũy

### 1. Xử Lý Sự Kiện Nổi Bọt (Event Propagation) Với React Portals & Dialog
- **Hiện tượng (Symptom):** Click vào các nút hành động (như Close, Copy, Share buttons) bên trong Modal/Dialog làm ứng dụng tự động nhảy/chuyển trang sang trang chi tiết bài viết (`/@username/post/:id`).
- **Nguyên nhân (Root Cause):** Trong React, dù Modal được render qua `DialogPortal` ở ngoài DOM node chính, hệ thống Synthetic Event của React vẫn lan truyền (bubble) ngược lên cây component cha (`PostCard` có chứa `onClick={handleCardClick}`).
- **Quy tắc phòng tránh (Prevention Rule):**
  1. Thêm `onClick={(e) => e.stopPropagation()}` trên container chính của Modal/Dialog (ví dụ `DialogContent`).
  2. Bổ sung `if (e) { e.stopPropagation(); e.preventDefault(); }` vào tất cả các hàm callback xử lý nút bấm trong Modal.

```jsx
/* Pattern chuẩn cho Modal/Dialog */
<Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onClick={(e) => e.stopPropagation()}>
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                handleAction();
            }}
        >
            Hành động
        </button>
    </DialogContent>
</Dialog>
```

---

### 2. Chuyển DOM Thành Ảnh PNG Với `html-to-image`
- **Hiện tượng (Symptom):** Bấm "Sao chép dưới dạng hình ảnh" báo lỗi *"Không thể tạo ảnh từ bài viết này"* và console in ra lỗi `Event { type: "error", target: img }`.
- **Nguyên nhân (Root Cause):** 
  1. Đọc sai tên thuộc tính avatar (`user.avatar` bị `undefined` thay vì `user.avatar_url`), dẫn tới fallback vào đường dẫn file không tồn tại (`/default-avatar.png`), kích hoạt sự kiện `error` trên thẻ `<img>`.
  2. Lỗi CORS hoặc nạp font ngoài khi `html-to-image` quét cây DOM.
- **Quy tắc phòng tránh (Prevention Rule):**
  1. Đảm bảo thuộc tính dữ liệu ánh xạ chính xác: `const avatarUrl = user.avatar_url || user.avatar || FALLBACK_AVATAR;`.
  2. Thẻ `<img>` phục vụ xuất ảnh BẮT BUỘC có `onError` fallback và `crossOrigin="anonymous"`.
  3. Cấu hình `htmlToImage.toPng` với `skipFonts: true` và `cacheBust: false`.

```jsx
/* Thẻ img xuất ảnh chuẩn */
<img
    src={avatarUrl}
    alt={user.username}
    onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
    crossOrigin="anonymous"
/>

/* Gọi htmlToImage chuẩn */
const dataUrl = await htmlToImage.toPng(node, {
    quality: 0.95,
    pixelRatio: 2,
    cacheBust: false,
    skipFonts: true,
});
```

---

### 3. Phân Quyền Hợp Lệ Cho Menu Tùy Chọn (3-Dots Post Menu)
- **Hiện tượng (Symptom):** Hiển thị các lựa chọn Chỉnh sửa/Xóa cho bài viết của người khác hoặc hiển thị Chặn/Báo cáo cho bài viết chính chủ.
- **Quy tắc phòng tránh (Prevention Rule):**
  1. Luôn luôn đối chiếu `currentUser.id === post.user.id` (hoặc username) để phân tách rõ danh sách options.
  2. Các hành động nguy hại (Block, Delete) BẮT BUỘC qua `ConfirmActionDialog` xác nhận trước khi thực thi.

---

### 4. Quy Trình Cập Nhật Bài Học Mới
Mỗi khi phát hiện lỗi mới và fix xong:
1. Đọc và phân tích đúng Root Cause.
2. Thêm một mục bài học mới vào file này (`.agents/skills/lessons-learned/SKILL.md`).
3. Đưa ra mẫu code/pattern chuẩn để áp dụng phòng tránh về sau.
