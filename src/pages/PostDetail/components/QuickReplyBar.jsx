import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { MediaIcon, GifIcon, NextIcon } from "@/assets/icons";
import { openReplyDialog } from "@/features/post/postSlice";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";

/**
 * Thanh soạn thảo trả lời nhanh ở đầu trang Chi Tiết Bài Viết
 */
function QuickReplyBar({ post }) {
    const dispatch = useDispatch();
    const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);
    const { setShowGuestDialog } = useGuestLogin();

    const targetUsername = post?.user?.username || "";
    const avatarUrl =
        authUser?.avatar ||
        authUser?.avatar_url ||
        "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

    const handleOpenReplyModal = (e) => {
        if (e) e.stopPropagation();
        if (!isAuthenticated) {
            setShowGuestDialog(true);
            return;
        }
        if (post) {
            dispatch(openReplyDialog(post));
        }
    };

    return (
        <div
            onClick={handleOpenReplyModal}
            className="bg-threads-content-bg px-6 py-3 cursor-pointer transition-colors hover:bg-threads-dropdown-hover/30"
        >
            <div className="bg-threads-bg border-threads-border flex items-center justify-between rounded-full border px-4 py-2">
                <div className="flex grow items-center gap-3">
                    <div className="h-7 w-7 overflow-hidden rounded-full shrink-0">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-threads-dim text-[14px] font-normal truncate">
                        {targetUsername ? `Trả lời ${targetUsername}...` : "Trả lời..."}
                    </span>
                </div>

                <div className="flex items-center gap-2.5 text-threads-dim">
                    <button
                        type="button"
                        onClick={handleOpenReplyModal}
                        className="hover:text-threads-text transition-colors"
                    >
                        <MediaIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenReplyModal}
                        className="hover:text-threads-text transition-colors"
                    >
                        <GifIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleOpenReplyModal}
                        className="hover:text-threads-text transition-colors"
                    >
                        <NextIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

QuickReplyBar.propTypes = {
    post: PropTypes.object,
};

export default QuickReplyBar;
