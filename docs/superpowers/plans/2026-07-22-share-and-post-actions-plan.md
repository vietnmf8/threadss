# Share Post, Embed Modal & Post More Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement remaining features for Section 7 in `docs/task-checklist.md`: Share Post modal (matching wireframe `sample/wireframe.html`), Copy Link, Copy as Image (`html-to-image`), Embed Modal (`EmbedModal.jsx`), and Post More Menu with permissions & confirmation modals.

**Architecture:** Encapsulated React components under `src/features/post/components/` and state hooks in `src/features/post/hooks/`. Radix UI `Dialog` for modals, Radix UI `ActionDropdown` for menus, Tailwind CSS v4 variables (`bg-threads-bg`, `text-threads-text`, `border-threads-border`) for seamless dark/light mode integration.

**Tech Stack:** React 19, Radix UI Dialog & Dropdown Menu, Tailwind CSS v4, `copy-to-clipboard`, `html-to-image`, `react-hot-toast`, i18next.

## Global Constraints
- React 19 ES6+ JS/JSX only (No TypeScript).
- Tailwind CSS v4 theme variables only.
- Import alias `@/` for `src/`.
- Semicolons required.
- Do NOT break existing tests or builds.

---

### Task 1: Install Dependencies (`copy-to-clipboard`, `html-to-image`)

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages via npm**

Execute command: `npm install copy-to-clipboard html-to-image`

- [ ] **Step 2: Verify package installation in package.json**

Check `package.json` to ensure `copy-to-clipboard` and `html-to-image` are present in dependencies.

---

### Task 2: Build `ShareModal.jsx` and `useSharePost.js`

**Files:**
- Create: `src/features/post/hooks/useSharePost.js`
- Create: `src/features/post/components/ShareModal.jsx`
- Modify: `src/assets/icons/index.js` (Export any missing SVG icons if needed, e.g., Link, Image, Globe icons or fallback to project icons)

**Interfaces:**
- `ShareModal` Props: `{ open: boolean, onOpenChange: (open: boolean) => void, post: object }`
- `useSharePost` Hook Returns: `{ handleCopyLink: () => void, handleCopyAsImage: () => void, handleOpenEmbed: () => void, isExporting: boolean }`

- [ ] **Step 1: Create `useSharePost.js` hook**

`useSharePost.js` handles:
1. `handleCopyLink`: Copy post URL (`window.location.origin + "/@" + post.user.username + "/post/" + post.id`) using `copy-to-clipboard`, show `toast.success`.
2. `handleCopyAsImage`: Trigger image conversion via `html-to-image` on the target card ref, trigger download, copy blob to clipboard, show `toast.success`.
3. `handleOpenEmbed`: Close ShareModal and open EmbedModal.

- [ ] **Step 2: Create `ShareModal.jsx` matching wireframe design**

Build `ShareModal.jsx` using Radix `Dialog` wrapper (`@/components/ui/dialog.jsx`).
Features:
- Header: "Hủy" (Cancel) & "Gửi đến" (Send to).
- Search Bar: "Tìm kiếm trang cá nhân Threads" with Search icon.
- Empty search result placeholder area.
- Bottom Action Bar:
  - Button 1: "Tin trên Instagram" (Instagram story gradient icon)
  - Button 2: "Sao chép liên kết" (Copy link icon)
  - Button 3: "Sao chép dưới dạng hình ảnh" (Copy as image icon)
  - Button 4: "Mã nhúng" (Embed code icon)
- Responsive for mobile & desktop, dark/light theme support.

---

### Task 3: Build `PostExportCard.jsx` for PNG Export

**Files:**
- Create: `src/features/post/components/PostExportCard.jsx`

**Interfaces:**
- `PostExportCard` Props: `{ post: object, cardRef: React.RefObject }`

- [ ] **Step 1: Create `PostExportCard.jsx`**

Render a clean, high-resolution visual post card (avatar, display name, username, creation time, text content, image/media if available, Threads watermark/logo footer) positioned offscreen (`fixed -left-[9999px] top-0`) so `html-to-image` can capture a clean PNG without action buttons or UI artifacts.

---

### Task 4: Build `EmbedModal.jsx`

**Files:**
- Create: `src/features/post/components/EmbedModal.jsx`

**Interfaces:**
- `EmbedModal` Props: `{ open: boolean, onOpenChange: (open: boolean) => void, post: object }`

- [ ] **Step 1: Create `EmbedModal.jsx`**

Features:
- Header: "Mã nhúng" (Embed Code) + Close button.
- Preview section: `<iframe>` pointing to `window.location.origin + "/@" + post.user.username + "/post/" + post.id + "/embed"`.
- Textarea containing formatted embed code:
  `<iframe src="${embedUrl}" width="540" height="480" frameborder="0" scrolling="no"></iframe>`
- Action button: "Sao chép mã" (Copy code button using `copy-to-clipboard` + toast notification).

---

### Task 5: Build `PostMoreMenu.jsx`, `ConfirmActionDialog.jsx`, and `ReportModal.jsx`

**Files:**
- Create: `src/features/post/components/ConfirmActionDialog.jsx`
- Create: `src/features/post/components/ReportModal.jsx`
- Create: `src/features/post/components/PostMoreMenu.jsx`
- Modify: `src/features/post/components/StandardPostHeader.jsx`

**Interfaces:**
- `PostMoreMenu` Props: `{ post: object }`

- [ ] **Step 1: Create `ConfirmActionDialog.jsx`**

Dialog for confirming destructive actions (Block user, Delete post) with title, description, Cancel and Confirm buttons.

- [ ] **Step 2: Create `ReportModal.jsx`**

Modal listing report reason options (Spam, Harassment, Misinformation, Inappropriate content) with submit button and success toast.

- [ ] **Step 3: Create `PostMoreMenu.jsx`**

Render 3-dots dropdown menu using `ActionDropdown` & `ActionMenuItem`.
Check `currentUser?.id === post.user?.id`:
- Owner Options: Edit, Delete (opens ConfirmActionDialog), Copy link.
- Other User Options: Save/Unsave, Not interested, Mute, Restrict, Block (opens ConfirmActionDialog), Report (opens ReportModal), Copy link.

- [ ] **Step 4: Update `StandardPostHeader.jsx`**

Replace static `MorePostIcon` with `<PostMoreMenu post={post} />`.

---

### Task 6: Integrate Share & Actions into `PostActions.jsx` and `Home`

**Files:**
- Modify: `src/features/post/components/PostActions.jsx`
- Modify: `docs/task-checklist.md` (Update completed checklist items for Section 7)

- [ ] **Step 1: Wire Share Modal in `PostActions.jsx`**

Connect `handleShare` to open `ShareModal`. Pass post data into `ShareModal` and `EmbedModal`.

- [ ] **Step 2: Run dev server / test UI rendering**

Verify `npm run dev` builds cleanly without console or JSX errors.

- [ ] **Step 3: Update `docs/task-checklist.md`**

Mark all completed Section 7 checkboxes as `[x]`.
