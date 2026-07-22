import React from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";
import { openPostDialog } from "@/features/post/postSlice";

function PostInput() {
    const { t } = useTranslation(["home"]);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { setShowGuestDialog } = useGuestLogin();

    // Avatar
    const userAvatar =
        user?.avatar ||
        user?.avatar_url ||
        "https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

    /* Mở Composer ở chế độ Thread mới */
    const handleOpenModal = () => {
        if (!isAuthenticated) {
            setShowGuestDialog(true);
            return;
        }
        dispatch(openPostDialog(null));
    };

    return (
        <div className="border-threads-border-width border-threads-border hidden border-b px-6 md:block">
            <div className="flex items-center gap-3 py-4">
                <Link
                    to={`/@${user?.username}`}
                    className="block shrink-0 cursor-pointer rounded-full"
                >
                    <img
                        src={userAvatar}
                        alt={user?.username || "User"}
                        className="outline-threads-border h-9 w-9 rounded-full object-cover outline-1"
                    />
                </Link>

                <div
                    onClick={handleOpenModal}
                    className="text-threads-dim grow cursor-text"
                >
                    <span className="text-threads-dim text-[15px] font-normal">
                        {t("home:whats_new")}
                    </span>
                </div>

                <div className="shrink-0">
                    <Button
                        variant="outline"
                        onClick={handleOpenModal}
                        className={cn(
                            "h-9 rounded-[10px] border px-4 text-[15px] font-semibold",
                            "border-threads-border text-threads-text bg-transparent hover:bg-transparent",
                            "cursor-pointer shadow-none",
                        )}
                    >
                        {t("home:post_btn")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PostInput;
