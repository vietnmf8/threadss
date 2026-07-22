import React, { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const REPORT_REASONS = [
    { id: "spam", label: "Spam hoặc quảng cáo không mong muốn" },
    { id: "harassment", label: "Quấy rối hoặc bắt nạt" },
    { id: "hate_speech", label: "Ngôn từ thù ghét hoặc đe dọa" },
    { id: "misinformation", label: "Thông tin sai sự thật" },
    { id: "other", label: "Lý do khác" },
];

/**
 * Modal báo cáo bài viết vi phạm
 */
function ReportModal({ open, onOpenChange, post }) {
    const [selectedReason, setSelectedReason] = useState("spam");

    const handleSubmitReport = () => {
        toast.success("Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét bài viết này.");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[440px] w-full bg-threads-bg border border-threads-border text-threads-text rounded-3xl p-6 shadow-2xl">
                <DialogHeader className="mb-4 text-center">
                    <DialogTitle className="text-xl font-bold text-center">
                        Báo cáo bài viết
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <span className="text-sm text-threads-dim">
                        Hãy chọn lý do bạn muốn báo cáo bài viết của @{post?.user?.username || "người dùng này"}:
                    </span>

                    <div className="flex flex-col gap-2">
                        {REPORT_REASONS.map((reason) => (
                            <label
                                key={reason.id}
                                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                                    selectedReason === reason.id
                                        ? "border-threads-text bg-threads-hover"
                                        : "border-threads-border/60 hover:bg-threads-hover/50"
                                }`}
                            >
                                <span className="text-sm font-medium">
                                    {reason.label}
                                </span>
                                <input
                                    type="radio"
                                    name="reportReason"
                                    value={reason.id}
                                    checked={selectedReason === reason.id}
                                    onChange={() => setSelectedReason(reason.id)}
                                    className="accent-threads-text"
                                />
                            </label>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmitReport}
                        className="w-full py-3 mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors cursor-pointer"
                    >
                        Gửi báo cáo
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

ReportModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onOpenChange: PropTypes.func.isRequired,
    post: PropTypes.object,
};

export default ReportModal;
