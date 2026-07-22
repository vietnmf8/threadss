import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { PrevIcon, QuoteMoreIcon } from "@/assets/icons";

/**
 * Header chính của trang Chi Tiết Bài Viết (Post Detail)
 */
function PostDetailHeader({ title = "Thread", viewsCount }) {
    const navigate = useNavigate();

    return (
        <div className="border-threads-border flex h-14 w-full items-center justify-between border-b px-4">
            {/* Nút Quay lại & Tiêu đề */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-threads-text hover:bg-threads-dropdown-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95"
                    aria-label="Quay lại"
                >
                    <PrevIcon className="h-5 w-5" />
                </button>

                <div className="flex flex-col">
                    <h1 className="text-threads-text text-[17px] font-bold leading-tight">
                        {title}
                    </h1>
                    {viewsCount && (
                        <span className="text-threads-dim text-[12px] font-normal">
                            {viewsCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Icon More options */}
            <div className="flex items-center">
                <button
                    type="button"
                    className="text-threads-text hover:bg-threads-dropdown-hover flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95"
                >
                    <QuoteMoreIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

PostDetailHeader.propTypes = {
    title: PropTypes.string,
    viewsCount: PropTypes.string,
};

export default PostDetailHeader;
