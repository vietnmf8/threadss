---
name: ui-and-styling
description: Guidelines for Tailwind CSS v4, Shadcn/UI primitives, CSS variable theme tokens, and className merging with cn().
---

# UI Styling, Tailwind v4 & Shadcn Rules

## 1. Tailwind CSS v4 & Custom Tokens

The application uses Tailwind CSS v4 configured with `@theme inline` in `src/index.css`.

### Standard Color Tokens
- Backgrounds: `bg-threads-bg`, `bg-threads-content-bg`, `bg-threads-auth-bg`
- Text: `text-threads-text`, `text-threads-dim`, `text-threads-link`
- Borders: `border-threads-border`
- Hover states: `hover:bg-threads-hover`
- Action colors: `text-threads-like`, `text-threads-repost`, `text-threads-reply`

### Dark Mode
- Dark mode is configured with `@custom-variant dark (&:is(.dark *));`.
- Use standard `dark:` prefix in class names (e.g., `bg-white dark:bg-black`).

## 2. Using `cn()` Helper

Always import `cn` from `@/lib/utils` for dynamic or conditional class merging:

```jsx
import { cn } from "@/lib/utils";

function CustomCard({ className, isActive }) {
    return (
        <div
            className={cn(
                "bg-threads-content-bg rounded-xl p-4 transition-all",
                isActive && "border-threads-text border-2",
                className
            )}
        >
            Content
        </div>
    );
}
```

## 3. Class Variance Authority (`cva`)
For Shadcn components or reusable custom primitives, use `cva`:

```js
import { cva } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
```

## 4. UI Icons
- Use Lucide React icons from `lucide-react`.
- Custom SVG icons live in `src/assets/icons.jsx` or as SVGR imports.
