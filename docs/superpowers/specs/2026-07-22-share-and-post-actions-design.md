# Design Spec: Share Post, Embed Modal & Post More Menu (Checklist ## 7)

## Overview
Implement the remaining features of Section 7 in `docs/task-checklist.md`:
1. **Share Post Modal**: Complete UI matching `sample/wireframe.html` adapted to Threads dark/light mode design system and project SVG icons.
2. **Share Actions**:
   - **Copy Link**: Copy URL to clipboard + toast message.
   - **Copy as Image**: Convert clean Post preview node to PNG image using `html-to-image` + trigger download + copy to clipboard + toast.
   - **Get Embed Code**: Open `EmbedModal` displaying `<iframe>` code preview and copy code button.
3. **Post More Menu (3 Dots Menu)**:
   - Separate menu options for Post Owner vs Other Users.
   - Owner: Edit, Delete (with confirmation dialog), Copy Link.
   - Others: Save/Unsave, Not Interested, Mute, Restrict, Block (with confirmation dialog), Report (with Report reason modal), Copy Link.

## Component Architecture & Location

```
src/
├── features/post/
│   ├── components/
│   │   ├── ShareModal.jsx            # Full share modal (wireframe design)
│   │   ├── EmbedModal.jsx            # Embed iframe preview & copy code modal
│   │   ├── PostExportCard.jsx        # Clean hidden/export post preview for html-to-image
│   │   ├── PostMoreMenu.jsx          # 3-dots dropdown menu for StandardPostHeader
│   │   ├── ConfirmActionDialog.jsx   # Generic confirmation dialog (Block/Delete)
│   │   └── ReportModal.jsx           # Modal for selecting report reason
│   └── hooks/
│       ├── useSharePost.js           # Logic for share modal, copy link, image export
│       └── usePostMoreMenu.js        # Logic for post options, save, block, report, delete
```

## Detailed Specifications

### 1. Share Modal (`ShareModal.jsx`)
- Adapted from `sample/wireframe.html`:
  - **Header**: "Hủy" (Cancel button), title "Gửi đến" (Send to).
  - **Search Area**: Search input "Tìm kiếm trang cá nhân Threads" with `SearchIcon`.
  - **Body**: User list / search results placeholder area.
  - **Action Bar** (Bottom horizontal flex bar):
    - `Tin trên Instagram` (Instagram Story): Gradient Instagram icon button + label.
    - `Sao chép liên kết` (Copy Link): Link icon button + label.
    - `Sao chép dưới dạng hình ảnh` (Copy as Image): Image icon button + label.
    - `Mã nhúng` (Embed Code): Globe/Embed icon button + label.
- **Theme & Responsiveness**:
  - Uses CSS variable tokens (`bg-threads-bg`, `text-threads-text`, `border-threads-border`).
  - Supports light mode and dark mode natively.
  - Desktop: Centered modal dialog (`max-w-[700px]`, `rounded-3xl`).
  - Mobile: Responsive width & full touch layout.

### 2. Copy as Image (`html-to-image`)
- When user clicks "Sao chép dưới dạng hình ảnh":
  - Render `PostExportCard.jsx` (a simplified, pristine PostCard without action buttons or drop-shadow artifacts).
  - Use `htmlToImage.toPng(node)`.
  - Trigger file download using anchor tag `download="threads-post-${id}.png"`.
  - Copy PNG blob to clipboard using `navigator.clipboard`.
  - Display success toast: `toast.success("Đã sao chép bài viết dưới dạng hình ảnh")`.

### 3. Embed Modal (`EmbedModal.jsx`)
- Triggered by "Mã nhúng" button in Share Modal.
- Displays:
  - Title: "Mã nhúng" (Embed Code).
  - Preview container: `<iframe>` pointing to `window.location.origin + "/@" + post.user.username + "/post/" + post.id + "/embed"`.
  - Textarea / Read-only input containing:
    `<iframe src="${embedUrl}" width="540" height="480" frameborder="0" scrolling="no"></iframe>`
  - Button: "Sao chép mã" (Copy Code) -> Copies iframe tag to clipboard + displays success toast.

### 4. Post More Menu (`PostMoreMenu.jsx`)
- Integrates into `StandardPostHeader.jsx` replacing raw `MorePostIcon`.
- Options depending on post owner:
  - **Current User Post**:
    - Edit (`home:edit_post`)
    - Delete (`home:delete_post` - Red, opens ConfirmActionDialog)
    - Copy Link (`home:copy_link`)
  - **Other User Post**:
    - Save / Unsave (`home:save_post` / `home:unsave_post`)
    - Not Interested (`home:not_interested`)
    - Mute (`home:mute_user`)
    - Restrict (`home:restrict_user`)
    - Block (`home:block_user` - Red, opens ConfirmActionDialog)
    - Report (`home:report_post` - Red, opens ReportModal)
    - Copy Link (`home:copy_link`)

### 5. Packages to Install
- `copy-to-clipboard`: for cross-browser clipboard copying.
- `html-to-image`: for DOM to PNG conversion.
