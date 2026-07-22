---
name: verification
description: Quy trình kiểm thử & xác minh toàn diện dự án: Check checklist công việc, audit performance-review, run build và run lint (eslint .) 100% pass toàn bộ dự án, và cURL test tập trung vào đúng API/nghiệp vụ của task cần làm.
---

# Comprehensive Verification Skill (Xác Minh & Kiểm Thử Toàn Diện)

Hướng dẫn kiểm thử và xác minh toàn diện trước khi bàn giao công việc hoặc hoàn thành tính năng.

---

## 1. Các Trụ Cột Kiểm Thử Cốt Lõi

1. **Checklist Completion**: Đối chiếu và đảm bảo 100% hạng mục công việc trong `docs/task-checklist.md` được tích `[x]`.
2. **Performance Standard**: Kiểm tra hiệu năng theo bộ chuẩn `performance-review` (CLS = 0, Virtualized list, Keep-alive state, Cleanup event listeners, ngăn chặn sự kiện nổi bọt `e.stopPropagation()`).
3. **Build & Lint Pass 100% Toàn Dự Án**: 
   - Chạy `npm run build` đạt Exit code 0.
   - Chạy `npm run lint` (`eslint .`) trên **TOÀN BỘ DỰ ÁN**, đạt **0 ERRORS**. Không thu hẹp phạm vi linter chỉ vào một thư mục con.
4. **Targeted Feature / API Test với cURL (Chỉ Tập Trung Vào Task Cần Làm)**: 
   - CHỈ sử dụng `curl.exe` từ terminal gọi trực tiếp các API / tuyến đường (routes/endpoints) **LIÊN QUAN TRỰC TIẾP** đến tính năng hoặc bài toán nghiệp vụ của task đang làm.
   - Tuyệt đối KHÔNG test các API không liên quan (như Login, Auth...) gây lãng phí thời gian.
   - Kiểm tra chính xác HTTP Status Code (200, 201, 400, 401, 422), Response Headers và cấu trúc JSON trả về cho các luồng nghiệp vụ của task (Main Flow, Secondary Flow & Edge Cases).

---

## 2. Các Bước Thực Hiện Quy Trình Xác Minh

### Bước 1: Đối Chiếu Checklist (`docs/task-checklist.md`)
- Mở file `docs/task-checklist.md`.
- Rà soát từng section và subtask liên quan đến yêu cầu hiện tại.
- Đảm bảo 100% công việc đã thực hiện đầy đủ và đánh dấu `[x]`.

### Bước 2: Audit Hiệu Năng & Sự Kiện (`performance-review`)
- Rà soát code theo tiêu chuẩn của skill `performance-review`:
  - **Memory & Cleanup**: Đảm bảo tất cả `useEffect` có return cleanup function (clear timer, removeEventListener, abort controller).
  - **Chống Nổi Bọt Sự Kiện (Event Propagation)**: Các modal, dropdown menu hay action buttons nằm trên danh sách card BẮT BUỘC phải gọi `e.stopPropagation()` và `e.preventDefault()` để tránh gây nhảy trang/click nhầm ngoài ý muốn.
  - **CLS (Cumulative Layout Shift = 0)**: Giữ khung container placeholder minHeight khi render danh sách hoặc modal.

### Bước 3: Kiểm Tra Build & Lint Pass 100% Toàn Dự Án
- Kiểm tra build sản phẩm:
  ```bash
  npm run build
  ```
  *Yêu cầu:* Exit code 0, không có syntax error hay JSX error.

- Kiểm tra linter trên toàn bộ dự án:
  ```bash
  npm run lint
  ```
  *Yêu cầu:* Pass 100% với **0 ERRORS** trên toàn dự án (`eslint .`).

### Bước 4: cURL Test Tập Trung Vào Đúng Nghiệp Vụ Của Task Đang Làm
Sử dụng `curl.exe` kiểm tra các đường dẫn (routes) hoặc API thuộc phạm vi task:
- **Ví dụ với Task Share Post & Embed (Mục ##7)**:
  - Kiểm tra tuyến đường Embed Post preview route (`GET /@username/post/:postId/embed`):
    ```bash
    curl.exe -i -X GET http://localhost:5173/@namtran138/post/4097/embed
    ```
  - Kiểm tra API tương tác nếu task có gọi (ví dụ Save/Bookmark post, Delete post):
    ```bash
    curl.exe -i -X POST https://threads.f8team.dev/api/posts/4097/save -H "Authorization: Bearer <TOKEN>"
    ```
- **Lưu ý quan trọng**: Không thực hiện cURL test cho các API thuộc các mục khác không liên quan đến task hiện tại.

---

## 3. Khung Báo Cáo Kết Quả (Verification Report)

Sau khi thực hiện xong, tổng hợp báo cáo bằng Tiếng Việt theo định dạng:

```markdown
# Verification Report

- [x] **Checklist Task**: Pass 100% (`docs/task-checklist.md` updated cho Section của Task)
- [x] **Performance & Event Propagation**: Pass 100% (CLS = 0, e.stopPropagation clean)
- [x] **Build & Full Lint**: Pass 100% (`npm run build` & `npm run lint` 0 errors trên toàn bộ dự án)
- [x] **Targeted Task API / Route cURL Test**: Pass 100% (Chỉ tập trung test đúng các route/API thuộc phạm vi task)
```
