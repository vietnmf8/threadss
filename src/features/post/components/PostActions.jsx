import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getRepostMenuOptions } from "@/configs/postMenu";

import PostActionButton from "./PostActionButton";
import ActionDropdown from "@/components/ui/ActionDropdown";
import ActionMenuItem from "@/components/ui/ActionMenuItem";
import ShareModal from "./ShareModal";
import EmbedModal from "./EmbedModal";
import { usePostActions } from "../hooks/usePostActions";

/**
 * Component chính quản lý thanh tương tác bài viết (Like, Comment, Repost, Share)
 */
function PostActions(props) {
    const {
        actionsConfig,
        isMenuOpen,
        setIsMenuOpen,
        shareModalOpen,
        setShareModalOpen,
        embedModalOpen,
        setEmbedModalOpen,
        handleMenuAction,
        isAuthenticated,
        setShowGuestDialog,
        t,
    } = usePostActions(props);

    const { isReposted, post } = props;

    return (
        <>
            <div
                className="mt-2 -ml-3 flex items-center select-none"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Duyệt qua mảng cấu hình để hiển thị từng nút */}
                {actionsConfig.map((action) => {
                    const isDropdown = action.isDropdown;

                    /* Tạo Component nút bấm chung */
                    const ActionButton = (
                        <PostActionButton
                            {...action}
                            onPointerDown={(e) => {
                                if (isDropdown) {
                                    e.preventDefault();
                                }
                            }}
                            onClick={(e) => {
                                if (isDropdown) {
                                    e.stopPropagation();
                                    if (!isAuthenticated) {
                                        setShowGuestDialog(true);
                                    } else {
                                        setIsMenuOpen(true);
                                    }
                                    return;
                                }
                                action.onClick?.(e);
                            }}
                        />
                    );
                    // Kiểm tra xem nút này có phải là Dropdown không
                    if (action.isDropdown) {
                        return (
                            <ActionDropdown
                                key={action.id}
                                open={isMenuOpen}
                                align="start"
                                sideOffset={-2}
                                // Logic chặn mở menu nếu người dùng chưa đăng nhập
                                onOpenChange={setIsMenuOpen}
                                onPointerDown={(e) => e.preventDefault()}
                                trigger={
                                    <DropdownMenuTrigger asChild>
                                        {ActionButton}
                                    </DropdownMenuTrigger>
                                }
                            >
                                {/* Danh sách các lựa chọn trong menu Repost */}
                                {getRepostMenuOptions(isReposted).map(
                                    (option, idx) => (
                                        <Fragment key={option.id}>
                                            {idx > 0 && (
                                                <DropdownMenuSeparator className="bg-threads-border/50 -mx-2 my-1 h-[0.5px]" />
                                            )}
                                            <ActionMenuItem
                                                label={t(option.labelKey)}
                                                Icon={option.Icon}
                                                isDanger={option.isDanger}
                                                onClick={() =>
                                                    handleMenuAction(option.action)
                                                }
                                            />
                                        </Fragment>
                                    ),
                                )}
                            </ActionDropdown>
                        );
                    }

                    // Render các nút tương tác bình thường (Like, Reply, Share)
                    return <Fragment key={action.id}>{ActionButton}</Fragment>;
                })}
            </div>

            {/* Modal Chia sẻ bài viết (ShareModal - wireframe design) */}
            <ShareModal
                open={shareModalOpen}
                onOpenChange={setShareModalOpen}
                post={post}
                onOpenEmbed={() => setEmbedModalOpen(true)}
            />

            {/* Modal Mã nhúng (EmbedModal) */}
            <EmbedModal
                open={embedModalOpen}
                onOpenChange={setEmbedModalOpen}
                post={post}
            />
        </>
    );
}

PostActions.propTypes = {
    id: PropTypes.number.isRequired,
    post: PropTypes.object,
    likesCount: PropTypes.number,
    repliesCount: PropTypes.number,
    repostsCount: PropTypes.number,
    isLiked: PropTypes.bool,
    isReposted: PropTypes.bool,
};

export default PostActions;
