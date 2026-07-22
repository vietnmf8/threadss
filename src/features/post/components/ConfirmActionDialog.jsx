import React from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

/**
 * Confirmation dialog cho các hành động cần xác nhận (Xóa bài viết, Chặn người dùng)
 */
function ConfirmActionDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Xác nhận",
    isDanger = true,
    onConfirm,
}) {
    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] w-full bg-threads-bg border border-threads-border text-threads-text rounded-3xl p-6 shadow-2xl">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-lg font-bold text-center">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-threads-dim text-sm mt-2 text-center">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-4">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className={`w-full py-3 font-semibold rounded-full transition-opacity cursor-pointer ${
                            isDanger
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-threads-text text-threads-bg hover:opacity-90"
                        }`}
                    >
                        {confirmText}
                    </button>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="w-full py-3 bg-threads-hover text-threads-text font-semibold rounded-full hover:bg-threads-border/40 transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

ConfirmActionDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    confirmText: PropTypes.string,
    isDanger: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
};

export default ConfirmActionDialog;
