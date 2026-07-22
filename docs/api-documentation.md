# Tài liệu API Dự án F8 Threads

Tài liệu chi tiết toàn bộ các Endpoint API của hệ thống **F8 Threads**, được trích xuất và chuẩn hóa từ Hoppscotch Collection.

---

## 1. Bảng Tổng quan Danh sách API (Master API Summary)

| STT | Tên API | HTTP Method | Endpoint | Xác thực (Auth) | Module |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Register | `POST` | `/api/auth/register` | Không | Authentication |
| **2** | Login | `POST` | `/api/auth/login` | Không | Authentication |
| **3** | Refresh Token | `POST` | `/api/auth/refresh` | Không | Authentication |
| **4** | Validate Username | `POST` | `/api/auth/validate/username` | Không | Authentication |
| **5** | Validate Email | `POST` | `/api/auth/validate/email` | Không | Authentication |
| **6** | Forgot Password | `POST` | `/api/auth/forgot-password` | Không | Authentication |
| **7** | Validate Reset Token | `GET` | `/api/auth/reset-password/validate` | Không | Authentication |
| **8** | Reset Password | `POST` | `/api/auth/reset-password` | Không | Authentication |
| **9** | Get User Info | `GET` | `/api/auth/user` | `Bearer Token` | Authentication |
| **10** | Logout | `POST` | `/api/auth/logout` | `Bearer Token` | Authentication |
| **11** | Verify Email | `POST` | `/api/auth/verify-email` | Không | Authentication |
| **12** | Resend Verification Email | `POST` | `/api/auth/resend-verification-email` | `Bearer Token` | Authentication |
| **13** | Delete Account | `POST` (DELETE) | `/api/auth/account` | `Bearer Token` | Authentication |
| **14** | Get Columns | `GET` | `/api/auth/columns` | `Bearer Token` | Authentication |
| **15** | Update Columns | `POST` (PUT) | `/api/auth/columns` | `Bearer Token` | Authentication |
| **16** | Update Profile | `POST` (PUT) | `/api/auth/profile` | `Bearer Token` | Authentication |
| **17** | Get Feed | `GET` | `/api/posts/feed` | `Bearer Token` (Tùy chọn/Yêu cầu khi đăng nhập) | Posts |
| **18** | Get Single Post | `GET` | `/api/posts/:id` | Không | Posts |
| **19** | Create Post | `POST` | `/api/posts` | `Bearer Token` | Posts |
| **20** | Update Post | `POST` (PUT) | `/api/posts/:id` | `Bearer Token` | Posts |
| **21** | Delete Post | `POST` (DELETE) | `/api/posts/:id` | `Bearer Token` | Posts |
| **22** | Get Replies | `GET` | `/api/posts/:id/replies` | Không | Posts |
| **23** | Get User Reposts | `GET` | `/api/users/:id/reposts` | `Bearer Token` (Tùy chọn) | Posts |
| **24** | Create Reply | `POST` | `/api/posts/:id/reply` | `Bearer Token` | Posts |
| **25** | Get Pending Replies | `GET` | `/api/posts/:id/pending-replies` | `Bearer Token` | Posts |
| **26** | Approve Reply | `POST` | `/api/posts/:id/replies/:replyId/approve` | `Bearer Token` | Posts |
| **27** | Reject Reply | `POST` | `/api/posts/:id/replies/:replyId/reject` | `Bearer Token` | Posts |
| **28** | Like Post | `POST` | `/api/posts/:id/like` | `Bearer Token` | Post Interactions |
| **29** | Repost | `POST` | `/api/posts/:id/repost` | `Bearer Token` | Post Interactions |
| **30** | Quote Post | `POST` | `/api/posts/:id/quote` | `Bearer Token` | Post Interactions |
| **31** | Save Post | `POST` | `/api/posts/:id/save` | `Bearer Token` | Post Interactions |
| **32** | Hide Post | `POST` | `/api/posts/:id/hide` | `Bearer Token` | Post Interactions |
| **33** | Report Post | `POST` | `/api/posts/:id/report` | `Bearer Token` | Post Interactions |
| **34** | Mute User | `POST` | `/api/users/:id/mute` | `Bearer Token` | User Actions |
| **35** | Unmute User | `POST` (DELETE) | `/api/users/:id/mute` | `Bearer Token` | User Actions |
| **36** | Restrict User | `POST` | `/api/users/:id/restrict` | `Bearer Token` | User Actions |
| **37** | Block User | `POST` | `/api/users/:id/block` | `Bearer Token` | User Actions |
| **38** | Unblock User | `POST` (DELETE) | `/api/users/:id/block` | `Bearer Token` | User Actions |
| **39** | Follow User | `POST` | `/api/users/:id/follow` | `Bearer Token` | Follow |
| **40** | Unfollow User | `POST` (DELETE) | `/api/users/:id/follow` | `Bearer Token` | Follow |
| **41** | Get Followers | `GET` | `/api/users/:id/followers` | `Bearer Token` | Follow |
| **42** | Get Followings | `GET` | `/api/users/:id/followings` | `Bearer Token` | Follow |
| **43** | Search Topics & Users | `GET` | `/api/search` | `Bearer Token` (Tùy chọn) | Search |
| **44** | Search Topics | `GET` | `/api/topics/search` | Không | Search |
| **45** | Get Follow Suggestions | `GET` | `/api/users/suggestions` | `Bearer Token` (Tùy chọn) | Search |
| **46** | Upload Avatar | `POST` | `/api/upload/avatar` | `Bearer Token` | File Upload |
| **47** | Upload Media | `POST` | `/api/upload/media` | `Bearer Token` | File Upload |

---

## 2. Chi tiết API theo Module

### 2.1 Authentication Module

#### 1. Register (Đăng ký tài khoản)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/register`
- **Auth:** Không yêu cầu
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-origin`: `<<origin>>` *(URL Frontend để gửi link xác thực)*
- **Body Payload (JSON):**
```json
{
    "username": "example_user",
    "email": "user@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!"
}
```

#### 2. Login (Đăng nhập)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/login`
- **Auth:** Không yêu cầu
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "login": "user@example.com",
    "password": "Password123!"
}
```

#### 3. Refresh Token (Cấp lại Access Token)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/refresh`
- **Auth:** Không yêu cầu
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "refresh_token": "<<refresh_token>>"
}
```

#### 4. Validate Username
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/validate/username`
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "username": "test_username"
}
```

#### 5. Validate Email
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/validate/email`
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "email": "test@example.com"
}
```

#### 6. Forgot Password (Yêu cầu đặt lại mật khẩu)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/forgot-password`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-origin`: `<<origin>>` *(URL Frontend cho link reset password)*
- **Body Payload (JSON):**
```json
{
    "email": "user@example.com"
}
```

#### 7. Validate Reset Token
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/auth/reset-password/validate`
- **Query Params:**
  - `token`: `string` *(Mã token reset password nhận qua email)*

#### 8. Reset Password (Đặt lại mật khẩu mới)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/reset-password`
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "token": "reset_token_here",
    "email": "user@example.com",
    "password": "NewPassword123!",
    "password_confirmation": "NewPassword123!"
}
```

#### 9. Get User Info (Lấy thông tin người dùng hiện tại)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/auth/user`
- **Auth:** `Bearer <<access_token>>`
- **Headers:** `Authorization: Bearer <<access_token>>`

#### 10. Logout (Đăng xuất)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/logout`
- **Auth:** `Bearer <<access_token>>`
- **Headers:** `Authorization: Bearer <<access_token>>`

#### 11. Verify Email (Xác thực Email)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/verify-email`
- **Headers:** `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "token": "email_verification_token"
}
```

#### 12. Resend Verification Email (Gửi lại email xác thực)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/auth/resend-verification-email`
- **Auth:** `Bearer <<access_token>>`
- **Headers:**
  - `Authorization`: `Bearer <<access_token>>`
  - `x-origin`: `<<origin>>`

#### 13. Delete Account (Xóa tài khoản)
- **Method:** `POST` *(Override: DELETE)*
- **Endpoint:** `<<base_url>>/api/auth/account`
- **Auth:** `Bearer <<access_token>>`
- **Headers:** `Authorization: Bearer <<access_token>>`, `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "_method": "DELETE"
}
```

#### 14. Get Columns (Lấy danh sách cột giao diện tùy chỉnh)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/auth/columns`
- **Auth:** `Bearer <<access_token>>`

#### 15. Update Columns (Cập nhật danh sách cột giao diện)
- **Method:** `POST` *(Override: PUT)*
- **Endpoint:** `<<base_url>>/api/auth/columns`
- **Auth:** `Bearer <<access_token>>`
- **Headers:** `Authorization: Bearer <<access_token>>`, `Content-Type: application/json`
- **Body Payload (JSON):**
```json
{
    "_method": "PUT",
    "columns": ["home", "search", "activity"]
}
```

#### 16. Update Profile (Cập nhật hồ sơ cá nhân)
- **Method:** `POST` *(Override: PUT)*
- **Endpoint:** `<<base_url>>/api/auth/profile`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):**
  - `_method`: `"PUT"`
  - `name`: `"Tên hiển thị"`
  - `username`: `"username_moi"`
  - `bio`: `"Mô tả bản thân"`
  - `avatar`: `File (ảnh)`
  - `is_private`: `"true" | "false"`

---

### 2.2 Posts Module

#### 1. Get Feed (Lấy Bảng tin bài viết)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/posts/feed`
- **Auth:** `Bearer <<access_token>>` *(Yêu cầu khi đã đăng nhập)*
- **Query Params:**
  - `type`: `for_you` | `following` | `ghost` *(bắt buộc khi đã đăng nhập)*
  - `page`: `number`
  - `per_page`: `number`

#### 2. Get Single Post (Lấy chi tiết 1 bài viết)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/posts/:id`
- **URL Params:** `id` *(ID bài viết)*

#### 3. Create Post (Tạo bài viết mới)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON hoặc Form Data):**
```json
{
    "content": "Nội dung bài viết mới",
    "topic_name": "Tên chủ đề",
    "reply_permission": "everyone"
}
```

#### 4. Update Post (Chỉnh sửa bài viết)
- **Method:** `POST` *(Override: PUT)*
- **Endpoint:** `<<base_url>>/api/posts/:id`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):**
  - `_method`: `"PUT"`
  - `content`: `"Nội dung cập nhật"`
  - `media[]`: `Files`
  - `reply_permission`: `"everyone" | "followers" | "mentioned"`
  - `topic_name`: `"Chủ đề"`

#### 5. Delete Post (Xóa bài viết)
- **Method:** `POST` *(Override: DELETE)*
- **Endpoint:** `<<base_url>>/api/posts/:id`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON):**
```json
{
    "_method": "DELETE"
}
```

#### 6. Get Replies (Lấy danh sách phản hồi của bài viết)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/posts/:id/replies`
- **URL Params:** `id`
- **Query Params:** `page`, `per_page`

#### 7. Get User Reposts (Lấy danh sách bài viết đã Repost của User)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/users/:id/reposts`
- **Auth:** `Bearer <<access_token>>` *(Tùy chọn)*
- **Query Params:** `page`, `per_page`

#### 8. Create Reply (Tạo phản hồi cho bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/reply`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):**
  - `content`: `"Nội dung phản hồi"`
  - `media[]`: `Files`
  - `reply_permission`: `"everyone"`

#### 9. Get Pending Replies (Lấy danh sách phản hồi đang chờ duyệt)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/posts/:id/pending-replies`
- **Auth:** `Bearer <<access_token>>`
- **Query Params:** `page`, `per_page`

#### 10. Approve Reply (Duyệt bài phản hồi)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/replies/:replyId/approve`
- **Auth:** `Bearer <<access_token>>`
- **URL Params:** `id`, `replyId`

#### 11. Reject Reply (Từ chối bài phản hồi)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/replies/:replyId/reject`
- **Auth:** `Bearer <<access_token>>`
- **URL Params:** `id`, `replyId`

---

### 2.3 Post Interactions Module

#### 1. Like Post (Thích / Bỏ thích bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/like`
- **Auth:** `Bearer <<access_token>>`

#### 2. Repost (Đăng lại bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/repost`
- **Auth:** `Bearer <<access_token>>`

#### 3. Quote Post (Dẫn lại bài viết kèm bình luận)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/quote`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):** `content`, `media[]`, `reply_permission`

#### 4. Save Post (Lưu / Bỏ lưu bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/save`
- **Auth:** `Bearer <<access_token>>`

#### 5. Hide Post (Ẩn bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/hide`
- **Auth:** `Bearer <<access_token>>`

#### 6. Report Post (Báo cáo bài viết)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/posts/:id/report`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON):**
```json
{
    "reason": "Spam / Nội dung vi phạm",
    "description": "Mô tả chi tiết lý do báo cáo"
}
```

---

### 2.4 User Actions Module

#### 1. Mute User (Tắt thông báo người dùng)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/users/:id/mute`
- **Auth:** `Bearer <<access_token>>`

#### 2. Unmute User (Bật lại thông báo người dùng)
- **Method:** `POST` *(Override: DELETE)*
- **Endpoint:** `<<base_url>>/api/users/:id/mute`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON):** `{"_method": "DELETE"}`

#### 3. Restrict User (Hạn chế người dùng)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/users/:id/restrict`
- **Auth:** `Bearer <<access_token>>`

#### 4. Block User (Chặn người dùng)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/users/:id/block`
- **Auth:** `Bearer <<access_token>>`

#### 5. Unblock User (Bỏ chặn người dùng)
- **Method:** `POST` *(Override: DELETE)*
- **Endpoint:** `<<base_url>>/api/users/:id/block`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON):** `{"_method": "DELETE"}`

---

### 2.5 Follow Module

#### 1. Follow User (Theo dõi người dùng)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/users/:id/follow`
- **Auth:** `Bearer <<access_token>>`

#### 2. Unfollow User (Bỏ theo dõi người dùng)
- **Method:** `POST` *(Override: DELETE)*
- **Endpoint:** `<<base_url>>/api/users/:id/follow`
- **Auth:** `Bearer <<access_token>>`
- **Body Payload (JSON):** `{"_method": "DELETE"}`

#### 3. Get Followers (Lấy danh sách người theo dõi)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/users/:id/followers`
- **Auth:** `Bearer <<access_token>>`

#### 4. Get Followings (Lấy danh sách đang theo dõi)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/users/:id/followings`
- **Auth:** `Bearer <<access_token>>`

---

### 2.6 Search Module

#### 1. Search Topics and Users (Tìm kiếm bài viết, chủ đề & người dùng)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/search`
- **Auth:** `Bearer <<access_token>>` *(Tùy chọn)*
- **Query Params:**
  - `q`: `string` *(Từ khóa tìm kiếm, tối thiểu 2 ký tự)*
  - `page`: `number`
  - `per_page_topics`: `number`
  - `per_page_users`: `number`

#### 2. Search Topics (Tìm kiếm chủ đề)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/topics/search`
- **Query Params:**
  - `q`: `string` *(Tối thiểu 2 ký tự)*

#### 3. Get Follow Suggestions (Lấy gợi ý người dùng để theo dõi)
- **Method:** `GET`
- **Endpoint:** `<<base_url>>/api/users/suggestions`
- **Auth:** `Bearer <<access_token>>` *(Tùy chọn)*
- **Query Params:** `page`, `per_page`

---

### 2.7 File Upload Module

#### 1. Upload Avatar (Tải lên ảnh đại diện)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/upload/avatar`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):** `avatar` *(File)*

#### 2. Upload Media (Tải lên nhiều tệp truyền thông/hình ảnh/video)
- **Method:** `POST`
- **Endpoint:** `<<base_url>>/api/upload/media`
- **Auth:** `Bearer <<access_token>>`
- **Content-Type:** `multipart/form-data`
- **Body Fields (FormData):** `media[]` *(Danh sách Files)*
