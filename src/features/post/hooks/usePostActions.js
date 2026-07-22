import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    LikedIcon,
    LikeIcon,
    ReplyIcon,
    RepostedIcon,
    RepostIcon,
    ShareIcon,
} from "@/assets/icons";
import { useLikePostMutation, useRepostPostMutation } from "@/services/post";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";
import { openPostDialog } from "../postSlice";

/**
 * Logic xử lý cho các hành động của bài viết
 */
export const usePostActions = (props) => {
    const { id, likesCount, repliesCount, repostsCount, isLiked, isReposted } =
        props;
    const dispatch = useDispatch();
    const { t } = useTranslation(["home"]);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { setShowGuestDialog } = useGuestLogin();
    const [likePost] = useLikePostMutation();
    const [repostPost] = useRepostPostMutation();

    /* State quản lý việc đóng/mở menu Repost & Share Modals */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [embedModalOpen, setEmbedModalOpen] = useState(false);

    /* Hàm kiểm tra đăng nhập */
    const withAuth = useCallback(
        (callback) => (e) => {
            if (e) e.stopPropagation();
            if (!isAuthenticated) {
                setShowGuestDialog(true);
                return;
            }
            callback();
        },
        [isAuthenticated, setShowGuestDialog],
    );

    /* Xử lý Like */
    const handleLike = useCallback(async () => {
        try {
            await likePost(id).unwrap();
        } catch (error) {
            console.error("Like thất bại:", error);
        }
    }, [id, likePost]);

    /* Xử lý Repost (Đóng menu trước rồi mới gọi API) */
    const handleRepostToggle = useCallback(async () => {
        setIsMenuOpen(false);
        try {
            await repostPost(id).unwrap();
        } catch (error) {
            console.error("Repost thất bại:", error);
        }
    }, [id, repostPost]);

    /* Xử lý Quote action */
    const handleQuote = useCallback(() => {
        setIsMenuOpen(false);
        if (props.post) {
            dispatch(openPostDialog(props.post));
        }
    }, [dispatch, props.post]);

    /* Xử lý tập trung các hành động từ Dropdown Menu */
    const handleMenuAction = useCallback(
        (actionType) => {
            switch (actionType) {
                case "TOGGLE_REPOST":
                    withAuth(handleRepostToggle)();
                    break;
                case "QUOTE":
                    withAuth(handleQuote)();
                    break;
                default:
                    console.warn("Hành động không xác định:", actionType);
                    break;
            }
        },
        [withAuth, handleRepostToggle, handleQuote],
    );

    /* Xử lý Phản hồi */
    const handleReply = useCallback(() => {
        console.log("Mở Modal Reply cho bài viết:", id);
    }, [id]);

    /* Xử lý Chia sẻ */
    const handleShare = useCallback(() => {
        setShareModalOpen(true);
    }, []);

    /* Cấu hình danh sách các nút  */
    const actionsConfig = useMemo(
        () => [
            {
                id: "like",
                Icon: isLiked ? LikedIcon : LikeIcon,
                count: likesCount,
                active: isLiked,
                activeClass: "text-threads-like",
                onClick: withAuth(handleLike),
            },
            {
                id: "reply",
                Icon: ReplyIcon,
                count: repliesCount,
                active: false,
                onClick: withAuth(handleReply),
            },
            {
                id: "repost",
                Icon: isReposted ? RepostedIcon : RepostIcon,
                count: repostsCount,
                active: isReposted,
                activeClass:
                    "text-threads-icon-action group-hover:text-threads-icon-action",
                isDropdown: true,
            },
            {
                id: "share",
                Icon: ShareIcon,
                count: 0,
                active: false,
                onClick: withAuth(handleShare),
            },
        ],
        [
            isLiked,
            isReposted,
            likesCount,
            repliesCount,
            repostsCount,
            withAuth,
            handleLike,
            handleReply,
            handleShare,
        ],
    );

    return {
        actionsConfig,
        isMenuOpen,
        setIsMenuOpen,
        shareModalOpen,
        setShareModalOpen,
        embedModalOpen,
        setEmbedModalOpen,
        handleMenuAction,
        handleRepostToggle,
        isAuthenticated,
        setShowGuestDialog,
        t,
    };
};
