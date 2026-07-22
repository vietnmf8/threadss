import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Dialog xác nhận đóng khi đang có nội dung thay đổi.
 */
function ConfirmCloseDialog({
    isOpen,
    onOpenChange,
    isQuote,
    onDiscard,
    onSave,
}) {
    const { t } = useTranslation(["home"]);

    /* Cấu hình nội dung dựa trên mode (Post vs Quote) */
    const title = isQuote
        ? t("home:confirm_discard_thread_title")
        : t("home:confirm_save_draft_title");

    /* Mô tả */
    const description = isQuote ? null : t("home:confirm_save_draft_desc");

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {/* Lớp Overlay  */}
            <DialogContent
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()}
                // Tự động trả focus về input sau khi đóng dialog
                onCloseAutoFocus={(e) => {
                    const textarea = document.querySelector("textarea");
                    if (textarea) {
                        e.preventDefault();
                        textarea.focus();
                    }
                }}
                className={cn(
                    "border-threads-border bg-threads-content-bg z-70 overflow-hidden p-0 pt-1 shadow-2xl",
                    "flex w-70 flex-col items-center rounded-2xl text-center",
                )}
            >
                {/* Header Section */}
                <DialogTitle className="text-threads-text mb-3 px-6 pt-5 pb-2 text-[16px] leading-5.25 font-bold">
                    {title}
                </DialogTitle>

                {description && (
                    <DialogDescription className="text-threads-dim px-6 pb-5 text-[15px] leading-snug font-normal">
                        {description}
                    </DialogDescription>
                )}

                {/* Danh sách nút bấm */}
                <div
                    className={cn(
                        "flex w-full",
                        isQuote
                            ? "border-threads-border flex-row-reverse border-t"
                            : "flex-col",
                    )}
                >
                    {/* Nút Save: Chỉ hiện ở Post Mode (Xếp dọc) */}
                    {!isQuote && (
                        <button
                            onClick={onSave}
                            className="border-threads-border text-threads-text active:bg-threads-hover flex h-13.5 w-full cursor-pointer items-center justify-center border-t text-[16px] font-bold transition-all"
                        >
                            {t("home:save")}
                        </button>
                    )}

                    {/* Nút Discard / Don't Save (Màu đỏ) */}
                    <button
                        onClick={onDiscard}
                        className={cn(
                            "text-threads-like active:bg-threads-hover flex h-13.5 cursor-pointer items-center justify-center text-[16px] transition-all",
                            isQuote
                                ? "border-threads-border flex-1 border-l font-bold"
                                : "border-threads-border w-full border-t",
                        )}
                    >
                        {isQuote ? t("home:discard") : t("home:dont_save")}
                    </button>

                    {/* Nút Cancel (Màu mặc định) */}
                    <button
                        autoFocus
                        onClick={() => onOpenChange(false)}
                        className={cn(
                            "text-threads-text active:bg-threads-hover flex h-13.5 cursor-pointer items-center justify-center text-[16px] font-normal transition-all",
                            isQuote
                                ? "flex-1"
                                : "border-threads-border w-full border-t",
                        )}
                    >
                        {t("home:cancel")}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

ConfirmCloseDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    isQuote: PropTypes.bool,
    onDiscard: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ConfirmCloseDialog;
