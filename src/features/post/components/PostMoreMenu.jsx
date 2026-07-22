import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { MorePostIcon } from "@/assets/icons";
import ActionDropdown from "@/components/ui/ActionDropdown";
import ActionMenuItem from "@/components/ui/ActionMenuItem";
import {
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostMoreMenu } from "../hooks/usePostMoreMenu";
import ConfirmActionDialog from "./ConfirmActionDialog";
import ReportModal from "./ReportModal";

/**
 * Component Menu 3 chấm (Post More Options) hiển thị trên góc phải bài viết
 * Hỗ trợ phân quyền: Chính chủ (Edit, Delete, Copy Link) và Người khác (Save, Not Interested, Mute, Restrict, Block, Report, Copy Link)
 */
function PostMoreMenu({ post }) {
    const {
        isOwner,
        isMenuOpen,
        setIsMenuOpen,
        isSaved,
        reportModalOpen,
        setReportModalOpen,
        confirmState,
        setConfirmState,
        handleCopyLink,
        handleToggleSave,
        handleNotInterested,
        handleMuteUser,
        handleRestrictUser,
        handleOpenBlockConfirm,
        handleOpenDeleteConfirm,
        handleEditPost,
        handleOpenReport,
    } = usePostMoreMenu(post);

    /* Cấu hình các item menu tùy theo người sở hữu bài viết */
    const options = isOwner
        ? [
              { id: "copy_link", label: "Sao chép liên kết", onClick: handleCopyLink },
              { id: "edit", label: "Chỉnh sửa bài viết", onClick: handleEditPost },
              {
                  id: "delete",
                  label: "Xóa bài viết",
                  isDanger: true,
                  onClick: handleOpenDeleteConfirm,
              },
          ]
        : [
              {
                  id: "save",
                  label: isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết",
                  onClick: handleToggleSave,
              },
              { id: "not_interested", label: "Không quan tâm", onClick: handleNotInterested },
              { id: "mute", label: `Tắt tiếng @${post?.user?.username || ""}`, onClick: handleMuteUser },
              { id: "restrict", label: `Hạn chế @${post?.user?.username || ""}`, onClick: handleRestrictUser },
              {
                  id: "block",
                  label: `Chặn @${post?.user?.username || ""}`,
                  isDanger: true,
                  onClick: handleOpenBlockConfirm,
              },
              {
                  id: "report",
                  label: "Báo cáo bài viết",
                  isDanger: true,
                  onClick: handleOpenReport,
              },
              { id: "copy_link", label: "Sao chép liên kết", onClick: handleCopyLink },
          ];

    return (
        <>
            <ActionDropdown
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                align="end"
                trigger={
                    <DropdownMenuTrigger asChild>
                        <div
                            role="button"
                            onClick={(e) => e.stopPropagation()}
                            className="group text-threads-dim relative flex cursor-pointer items-center justify-center p-1.5 focus:outline-none"
                            title="Tùy chọn khác"
                        >
                            <div className="bg-threads-dropdown-hover absolute top-1/2 left-1/2 -z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100" />
                            <MorePostIcon className="relative z-10 h-5 w-5 text-threads-dim group-hover:text-threads-text transition-colors" />
                        </div>
                    </DropdownMenuTrigger>
                }
            >
                {options.map((option, idx) => (
                    <Fragment key={option.id}>
                        {idx > 0 && (
                            <DropdownMenuSeparator className="bg-threads-border/50 -mx-2 my-1 h-[0.5px]" />
                        )}
                        <ActionMenuItem
                            label={option.label}
                            isDanger={option.isDanger}
                            onClick={() => {
                                setIsMenuOpen(false);
                                option.onClick();
                            }}
                        />
                    </Fragment>
                ))}
            </ActionDropdown>

            {/* Confirmation Dialog cho Block & Delete */}
            <ConfirmActionDialog
                open={confirmState.open}
                onOpenChange={(open) =>
                    setConfirmState((prev) => ({ ...prev, open }))
                }
                title={confirmState.title}
                description={confirmState.description}
                confirmText={confirmState.confirmText}
                isDanger={confirmState.isDanger}
                onConfirm={confirmState.onConfirm}
            />

            {/* Report Modal cho Report Post */}
            <ReportModal
                open={reportModalOpen}
                onOpenChange={setReportModalOpen}
                post={post}
            />
        </>
    );
}

PostMoreMenu.propTypes = {
    post: PropTypes.object,
};

export default PostMoreMenu;
