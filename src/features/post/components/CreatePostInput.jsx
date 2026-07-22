import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
    MediaIcon,
    GifIcon,
    EmojiIcon,
    PollIcon,
    TextIcon,
    LocationIcon,
    ArrowRightIcon,
    CrossIcon,
} from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { formatSnakeCaseText } from "@/utils/textFormatter";

/**
 * Component quản lý vùng nhập liệu văn bản và thanh công cụ.
 */
function CreatePostInput({
    thread,
    index,
    total,
    topic,
    onTopicUpdate,
    onUpdate,
    onRemove,
    isDialogOpen,
}) {
    const { t } = useTranslation(["home"]);
    const { user: reduxUser } = useSelector((state) => state.auth);
    const [displayUser, setDisplayUser] = useState(reduxUser);
    const textareaRef = useRef(null);

    // Placeholder động: Khối đầu là "Whats new" hoặc custom (dành cho Reply), khối sau là "Say more"
    const placeholderText =
        thread.customPlaceholder || (thread.placeholder ? t(thread.placeholder) : "");

    // Kiểm tra sự hiện diện của Topic Area
    const hasTopicRow = index === 0 || (index > 0 && topic.trim().length > 0);

    /* Lấy username nếu API chưa tải kịp */
    useEffect(() => {
        if (reduxUser) {
            setDisplayUser(reduxUser);
        } else {
            const storedUser = localStorage.getItem("lastLoggedInUser");
            if (storedUser) setDisplayUser(JSON.parse(storedUser));
        }
    }, [reduxUser]);

    /* Tự động focus vào textarea khi Dialog mở */
    useEffect(() => {
        if (isDialogOpen && textareaRef.current && index === total - 1) {
            const timer = setTimeout(() => {
                textareaRef.current.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [index, isDialogOpen, total]);

    /* Tự động giãn nở chiều cao theo nội dung nhập vào */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [thread.content]);

    /* Cấu hình Toolbar */
    const TOOLBAR_ITEMS = [
        { id: "media", Icon: MediaIcon },
        { id: "gif", Icon: GifIcon },
        { id: "emoji", Icon: EmojiIcon },
        { id: "poll", Icon: PollIcon },
        { id: "text", Icon: TextIcon },
        { id: "location", Icon: LocationIcon },
    ];

    return (
        <div className="flex grow flex-col">
            <div className="flex min-w-0 shrink grow flex-wrap items-start gap-x-0.75">
                {/* Tên người dùng đang soạn */}
                <span className="text-threads-text text-start text-[15px] leading-[1.4] font-semibold">
                    {displayUser?.username}
                </span>

                {/* Thêm chủ đề */}
                {hasTopicRow && (
                    <div className="flex max-w-73 flex-row">
                        <span className="relative top-px me-1 flex items-center">
                            {/* Arrow Icon */}
                            <ArrowRightIcon className="text-threads-dim h-3 w-3 shrink-0 -rotate-90" />
                        </span>

                        {/* Topic Input */}
                        <div
                            className="relative overflow-hidden whitespace-nowrap"
                            style={{
                                paddingRight: index === 0 ? "20px" : "0px",
                            }}
                        >
                            {/* Ghost/Mirror: xác định width thực tế của nội dung */}
                            <span
                                className={cn(
                                    "text-threads-text invisible block max-w-full min-w-0 overflow-visible text-start text-[15px] leading-[1.4] font-semibold wrap-break-word whitespace-pre-line",
                                )}
                            >
                                {topic || t("home:add_topic")}
                            </span>

                            <div className="absolute inset-0 flex items-center">
                                {index === 0 ? (
                                    <input
                                        type="search"
                                        autoComplete="off"
                                        value={topic}
                                        onChange={(e) =>
                                            onTopicUpdate(e.target.value)
                                        }
                                        placeholder={t("home:add_topic")}
                                        className={cn(
                                            "w-full max-w-70 min-w-42.5 bg-transparent px-0.5 outline-none",
                                            "text-threads-text text-start text-[15px] font-semibold",
                                            "placeholder:text-threads-dim leading-[1.4] placeholder:font-normal",
                                            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                                        )}
                                    />
                                ) : (
                                    <span className="text-threads-dim text-start text-[15px] font-semibold">
                                        {formatSnakeCaseText(topic)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Badge số lượng Multi Post */}
                {total > 1 && (
                    <div className="inline-block">
                        <div className="bg-threads-dropdown-hover flex items-center justify-center rounded-[12px] px-1.5 py-0.75">
                            {/* Chỉ số hiện tại */}
                            <span className="text-threads-dim relative block text-[12px] leading-[1.4em] font-semibold wrap-break-word whitespace-pre-line">
                                {index + 1}
                            </span>
                            <div className="flex ps-[1.5px] pe-px pb-px">
                                <span className="text-threads-dim relative block text-[12px] leading-[1.4em] font-normal">
                                    /
                                </span>
                            </div>
                            {/* Tổng số khối */}
                            <span className="text-threads-dim relative block text-[12px] leading-[1.4em] font-semibold">
                                {total}
                            </span>
                        </div>
                    </div>
                )}

                {/* Nút Xóa */}
                {index > 0 && (
                    <div className="ms-auto flex shrink-0 items-center self-stretch">
                        <div
                            onClick={() => onRemove(thread.id)}
                            className="relative cursor-pointer active:scale-90"
                        >
                            <CrossIcon className="text-threads-dim h-3 w-3" />
                        </div>
                    </div>
                )}
            </div>

            {/* Vùng nhập liệu */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={thread.content}
                    onChange={(e) => onUpdate(thread.id, e.target.value)}
                    placeholder={placeholderText}
                    rows={1}
                    className={cn(
                        "w-full resize-none overflow-hidden bg-transparent",
                        "text-threads-text text-[15px] leading-[1.4] font-normal outline-none",
                        "placeholder:text-threads-dim block",
                    )}
                />
            </div>

            {/* Thanh công cụ */}
            <div className="mt-1 -ml-2 flex h-9 items-center">
                {TOOLBAR_ITEMS.map(({ id, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        className="text-threads-dim flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-all active:scale-90"
                    >
                        <Icon className="h-5 w-5" />
                    </button>
                ))}
            </div>
        </div>
    );
}

CreatePostInput.propTypes = {
    thread: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    topic: PropTypes.string,
    onTopicUpdate: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    isDialogOpen: PropTypes.bool,
};

export default CreatePostInput;
