# Checklist Công Việc

## 3. Hoàn thành UI & Logic trang Login `Tự luận` [x] (Đã hoàn thành)

Tạo file `/src/pages/Auth/Login.jsx`

- [x] 1. Sử dụng AuthLayout cho trang login
- [x] 2. Có form login với 2 input: "Email hoặc tên người dùng" và "Mật khẩu", cả 2 đều bắt buộc nhập
- [x] 3. Khi click "Đăng nhập" với form hợp lệ thì gọi API "Login" và xử lý đăng nhập thành công hoặc xử lý lỗi (nếu có)
  - [x] 1. Đăng nhập thành công, lưu `access_token` và `refresh_token` vào localStorage, xử lý đính kèm access_token vào mọi request của instance Axios hoặc RTK Query (tùy thuộc bạn chọn sử dụng cái nào). Sử dụng API "Get User Info" để lấy thông tin người dùng đang đăng nhập và lưu vào global state
  - [x] 2. Đăng nhập thất bại hãy xử lý hiển thị lỗi, kiểm tra response để biết thêm chi tiết
- [x] 4. Khi token hết hạn (response code 401 và có refresh token lưu ở localStorage), thực hiện refresh token
  - [x] 1. Refresh thành công, lưu access_token và refresh_token mới vào localStorage và thực hiện gọi lại các API 401 trước đó
  - [x] 2. Refresh thất bại, chuyển hướng người dùng qua page `/login`
- [x] 5. Hiển thị link "Quên mật khẩu?" ở dưới input "Mật khẩu", nhấn vào chuyển trang `/forgot-password`
- [x] 6. Bổ sung text ở cuối trang "Bạn chưa có tài khoản? **Đăng ký**", nhấn vào chuyển trang `/register`

---

## 4. Hoàn thành trang Register `Tự luận` [x] (Đã hoàn thành)

Tạo file `/src/pages/Auth/Register.jsx`

- [x] 1. Sử dụng AuthLayout cho trang register
- [x] 2. Có form register với 4 input: "Tên hiển thị", "Email", "Mật khẩu", "Xác nhận mật khẩu" - tất cả bắt buộc
- [x] 3. Username và Email validation ngay sau khi gõ (debounce 600-800ms). Password tối thiểu 8 ký tự, phải trùng với Xác nhận mật khẩu
- [x] 4. Khi click "Đăng ký" với form hợp lệ thì gọi API và xử lý đăng ký thành công hoặc xử lý lỗi (nếu có)
  - [x] 1. Đăng ký thành công, hiển thị message "Chúng tôi đã gửi một liên kết xác thực tới email của bạn. Vui lòng kiểm tra email để xác thực tài khoản.". Vị trí hiển thị message ở giữa tiêu đề trang và input "Tên hiển thị"
  - [x] 2. Đăng ký thất bại, check response để xác định lỗi và hiển thị lỗi
- [x] 5. Bổ sung text "Đã có tài khoản? **Đăng nhập**", nhấn vào chuyển trang `/login`

---

## 5. Hoàn thành UI & Logic trang ForgotPassword `Tự luận` [x] (Đã hoàn thành)

Tạo file `/src/pages/Auth/ForgotPassword.jsx`. Dựa vào UI của Login và Register, thay đổi text và input để tạo ra trang "Quên mật khẩu".

- [x] 1. Sử dụng AuthLayout cho trang forgot password
- [x] 2. Mô tả: "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
- [x] 3. Có form với 1 input: "Email" - bắt buộc và validate định dạng email
- [x] 4. Khi click "Đặt lại mật khẩu" với form hợp lệ thì gọi API để gửi mã reset mật khẩu hoặc xử lý lỗi nếu có
- [x] 5. Nếu bước (5) thành công, hiển thị message (info) "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn".

---

## 6. Hoàn thành UI & Logic trang ResetPassword `Tự luận` [x] (Đã hoàn thành)

Tạo file `/src/pages/Auth/ResetPassword.jsx` để xây dựng trang reset passowrd.

> Khi nhấn vào liên kết đặt lại mật khẩu trong email sẽ mở page này kèm với `token` được truyền dưới dạng query params.

- [x] 1. Path của page này là `/reset-password`
- [x] 2. Sử dụng AuthLayout cho trang forgot password
- [x] 3. Nhận `token` từ query params, thực hiện gọi API để kiểm tra token có hợp hệ hay không, báo "Liên kết đã hết hạn hoặc không hợp lệ" khi có lỗi, hiển thị form "Tạo mật khẩu mới" nếu xác thực token thành công
- [x] 4. Có form với 2 input: "Mật khẩu mới", "Xác nhận mật khẩu" - validate giống form Register
- [x] 5. Khi click "Tạo mật khẩu mới" với form hợp lệ thì gọi API để reset password, nếu thành công chuyển qua trang `/login` với route state (*) chứa `message` "Tạo mật khẩu mới thành công, vui lòng đăng nhập" (tại page Login kiểm tra nếu có route state `message` thì hiển thị), và xử lý lỗi nếu có.

> (*) Tìm hiểu về cách sử dụng router state ở đây: [https://reactrouter.com/api/hooks/useNavigate](https://reactrouter.com/api/hooks/useNavigate)

---

## 7. Xây dựng Logic cho trang Home `Tự luận` [ ] (Chưa hoàn thành)

**Tính năng cần hoàn thiện:**

- [x] **Infinite Scroll:** Tạo custom hook `useInfiniteScroll` sử dụng Intersection Observer API, hoặc sử dụng thư viện `react-infinite-scroll-component`, hoặc `react-infinite-scroll-hook` để tự động load thêm posts khi user scroll đến cuối trang
- [x] **Like/Unlike Post:** Xử lý click button Like để like/unlike bài viết, icon đổi màu đỏ khi đã like, cập nhật số lượng ngay lập tức (optimistic update), gọi API để lưu trạng thái
- [x] **Repost Post:**
  - [x] **Repost/Unrepost:** Xử lý click button Repost để repost/unrepost bài viết, icon đổi màu xanh khi đã repost, cập nhật số lượng ngay lập tức (implement giống phần Like/Unlike ở trên)
  - [x] **Quote:** Khi click vào "Quote" thì mở QuoteModal (`/src/components/post/QuoteModal.jsx`), tập trung làm UI, còn logic làm sau
- [x] **Comment:** Click button Comment để mở modal "Reply", tập trung vào UI, logic mô tả ở bài sau
- [x] **Share Post:** Click button Share để mở menu share với options:
  - [x] **Copy link:** Dùng thư viện `copy-to-clipboard`
  - [x] **Copy as image:** Hiển thị modal như trong gốc, dùng `html-to-image` để chuyển DOM node sang ảnh, dùng `download` để tải xuống ảnh (có demo trong Readme của `html-to-image`, hãy đọc kỹ)
  - [x] **Get embed code:**
    - [x] Mở EmbedModal (`/src/components/post/EmbedModal.jsx`)
    - [x] Hiển thị preview, phần này khi nào làm trong page Embed thì dùng `iframe` để preview
    - [x] Code embed sử dụng thẻ `<iframe>` với src link về `location.origin + "/" + username + "/post/" + postId + "/embed"`. Cấu trúc URL đơn giản chỉ là: `https://domain.com/nguyenvana/post/DiyNUECS0k/embed`. Nhấn "Copy" sẽ sao chép code trên vào clipboard
- [x] **Post Menu (3 chấm):** Tạo dropdown menu với các options:
  - [x] **Save/Unsave:** Lưu bài viết vào collection
  - [x] **Not interested:** Ẩn bài viết khỏi feed
  - [x] **Mute:** Tắt tiếng người dùng này
  - [x] **Restrict:** Hạn chế người dùng này
  - [x] **Block:** Chặn người dùng (màu đỏ, cần confirmation modal)
  - [x] **Report:** Báo cáo bài viết (màu đỏ, mở modal chọn lý do)
  - [x] **Copy link:** Copy URL bài viết và hiển thị toast thông báo
  - [x] **Edit/Delete:** Chỉ hiển thị nếu là post của user hiện tại (Delete cần confirmation)
- [x] **API Integration:** Tạo `/src/services/postService.js` (hoặc `src/services/post.js`) với các methods để gọi API cho tất cả actions trên.

> Xử lý logic tại page Home, truyền các props bao gồm giá trị và callback vào các UI components để hiển thị và lắng nghe events.

---

## 8. Xây dựng ReplyModal `Tự luận` [x] (Hoàn thành)

Tạo file `/src/components/post/ReplyModal.jsx` để xây dựng ReplyModal như sau:

**Tính năng cần hoàn thiện:**

- [x] **Reply form:** Hiển thị bài viết gốc ở trên cùng, avatar của user hiện tại, username, placeholder "Reply to [username]...", và textarea để nhập nội dung reply
- [x] **Toolbar actions:** Thanh công cụ phía dưới textarea gồm 5 buttons:
  - Upload ảnh/video
  - Upload GIF
  - Chọn emoji
  - Poll/Survey (nếu cần)
  - Add location
- [x] **Add topic:** Link "Add a topic" để thêm topic/tag cho reply
- [x] **Add to thread:** Nút "Add to thread" để thêm reply này vào thread (tạo chuỗi nhiều posts)
- [x] **Reply options:** Nút "Reply options" ở cuối để cài đặt quyền reply (ai có thể reply lại comment này)
- [x] **Post button:** Nút "Post" để gửi reply, disabled khi chưa nhập gì, active khi đã có nội dung. Sau khi post thành công thì đóng modal và refresh danh sách comments

---

## 9. Xây dựng UI và Logic trang Embed Post `Tự luận` [x] (Đã hoàn thành)

Trang này tạo ra không phải phục vụ end-user truy cập trực tiếp, nó được sử dụng để mở trong thẻ `iframe` với mục đích cho phép nhúng post vào một trang web khác.

**Tính năng cần hoàn thiện:**

- [x] **Trang Embed:** Tạo file `/src/pages/Embed.jsx` với route `/:username/post/:postId/embed` để hiển thị một post dạng embed, không có Sidebar, không có LoginPanel, chỉ hiển thị PostCard đơn lẻ với white background.
- [x] **Layout Embed:** Tạo `/src/layouts/EmbedLayout.jsx` chứa layout đơn giản chỉ có main content full width, không có navigation, không có footer, phù hợp để nhúng vào iframe.
- [x] **Fetch Post data:** Trong Embed page gọi API để lấy thông tin post và hiển thị PostCard với đầy đủ thông tin: avatar, username, timestamp, content, media, interaction bar, "View on Theads".
- [x] **Responsive embed:** Trang Embed phải responsive, đảm bảo hiển thị tốt khi nhúng vào các website khác.

---

## 10. Xây dựng trang VerifyEmail `Tự luận` [x] (Đã hoàn thành)

Tạo file `/src/pages/Auth/VerifyEmail.jsx`

- [x] 1. Sử dụng AuthLayout làm wrapper cho trang này
- [x] 2. Khi component mount, đọc token từ URL parameter và tự động gọi API "Verify mail" với body {token} để xác thực
- [x] 3. Hiển thị loading spinner và text "Đang xác minh..." trong khi đang gọi API
- [x] 4. Khi API xác minh thất bại, hiển thị message lỗi "Liên kết đã hết hạn hoặc không hợp lệ." màu đỏ
- [x] 5. Khi thất bại, không hiển thị form, chỉ hiển thị button "Đi tới trang đăng nhập" để chuyển về `/login`
- [x] 6. Khi API thành công, tự động chuyển hướng về `/login`
- [x] 7. Khi chuyển về `/login` thành công, hiển thị message "Đã xác minh tài khoản thành công. Vui lòng đăng nhập." vị trí giữa tiêu đề và input đầu tiên
