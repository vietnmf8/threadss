import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileNav from "@/components/layout/MobileNav";
import MobileHeader from "@/components/layout/MobileHeader";
import FAB from "@/components/layout/FAB";
import RightColumn from "@/components/layout/RightColumn";
import paths from "@/configs/path";
import { useDispatch, useSelector } from "react-redux";
import LoginPanel from "@/pages/Home/components/LoginPanel";
import LoginButton from "@/components/layout/LoginButton";
import GuestLoginDialog from "@/features/auth/components/GuestLoginDialog";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";
import CreatePostDialog from "@/features/post/components/CreatePostDialog";
import ReplyModal from "@/features/post/components/ReplyModal";
import { useMeQuery } from "@/services/auth";
import { setUserInfo } from "@/features/auth/authSlice";

function DefaultLayout() {
    const dispatch = useDispatch();

    /* Lấy trạng thái đăng nhập */
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    /* Quản lý Dialog đăng nhập dành cho khách */
    const { showGuestDialog, setShowGuestDialog } = useGuestLogin();

    const location = useLocation();
    const isGhostPage = location.pathname === paths.ghost_posts;

    /* Tự động gọi API lấy thông tin user nếu đã có token nhưng chưa có dữ liệu info */
    const { data: userData } = useMeQuery(undefined, {
        skip: !isAuthenticated || !!user,
    });

    /* Cập nhật thông tin user vào Redux ngay khi API trả về kết quả */
    useEffect(() => {
        if (userData && !user) {
            dispatch(setUserInfo(userData));
        }
    }, [userData, user, dispatch]);

    return (
        <div className="bg-threads-bg text-threads-text flex min-h-screen font-sans antialiased">
            <DesktopSidebar />
            <MobileNav />
            <MobileHeader />

            {!isAuthenticated && (
                <LoginButton className="absolute top-[13.2px] right-3.5 z-50 hidden md:max-[1058px]:block" />
            )}

            {!isAuthenticated ? (
                <div
                    className={cn(
                        "flex w-full justify-center",
                        "md:px-5",
                        "justify-center min-[1059px]:justify-start min-[1111px]:justify-center",
                    )}
                >
                    <div className="hidden w-19 shrink-0 min-[1059px]:block" />
                    {/* Main Content */}
                    <main
                        className={cn(
                            "bg-threads-content-bg w-full",
                            "flex flex-col items-center",
                            "pt-(--threads-header-height) pb-(--threads-bottom-nav-height) md:py-0",
                            "max-w-full md:max-w-160",
                            "max-[1110px]:shrink-0",
                            "md:max-[870px]:max-w-[calc(100%-1.5*var(--threads-sidebar-width)-77px)]",
                        )}
                    >
                        <Outlet />
                    </main>

                    {/* Login Panel */}
                    <div className="hidden min-[1059px]:block">
                        <LoginPanel />
                    </div>
                </div>
            ) : (
                <>
                    {/* Nếu là Tab: Bài viết tự huỷ => Ẩn cột Right Column */}
                    {!isGhostPage && <RightColumn />}

                    {/* Wrapper */}
                    <div
                        className={cn(
                            "flex w-full justify-center",
                            "px-0 md:px-5",
                            "pt-(--threads-header-height) pb-(--threads-bottom-nav-height)",
                            "md:py-0",
                        )}
                    >
                        {/* Main Content */}
                        <main
                            className={cn(
                                "bg-threads-content-bg w-full",
                                "max-w-full",
                                "md:max-w-[calc(100%-1.5*var(--threads-sidebar-width))]",
                                "min-[800px]:max-w-(--threads-content-max-width)",
                                "flex w-full flex-col items-center",
                            )}
                        >
                            <Outlet />
                        </main>
                    </div>
                </>
            )}

            {/* FAB */}
            {isAuthenticated && <FAB />}

            {/* Dialog đăng nhập */}
            <GuestLoginDialog
                open={showGuestDialog}
                onOpenChange={setShowGuestDialog}
            />

            {/* Dialog soạn thảo chung */}
            <CreatePostDialog />

            {/* Modal phản hồi bài viết */}
            <ReplyModal />
        </div>
    );
}

export default DefaultLayout;
