import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import paths from "@/configs/path";
import { NAV_ITEMS } from "@/configs/navigation";
import NavItem from "./NavItem";
import { ThreadsIcon } from "@/assets/icons";
import SettingsMenu from "./SettingsMenu";
import { useDispatch, useSelector } from "react-redux";
import PinItem from "./PinItem";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";
import { useSmartNavigate } from "@/hooks/useSmartNavigate";
import { emitRefetchSignal } from "@/features/app/appSlice";

function DesktopSidebar() {
    /* Lấy trạng thái đăng nhập */
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { setShowGuestDialog, handleProtectedAction } = useGuestLogin();
    const { handleSmartClick } = useSmartNavigate();

    /* Phát tín hiệu refetch */
    const handleRefetchSignal = (feature) => {
        dispatch(emitRefetchSignal(feature));
    };

    /* Xử lý click Logo: Luôn coi là tín hiệu cho trang Home */
    const handleLogoClick = (e) => {
        handleSmartClick(e, paths.home, {
            onRefetch: () => handleRefetchSignal("home"),
        });
    };

    return (
        <>
            <div
                className={cn(
                    "fixed top-0 bottom-0 left-0 z-40 hidden md:flex",
                    "w-(--threads-sidebar-width) flex-col items-center justify-between",
                    "bg-threads-bg",
                )}
            >
                {/* Logo */}
                <div className="flex w-full items-center justify-center">
                    <Link
                        to={paths.home}
                        onClick={handleLogoClick}
                        className="ease-spring flex items-center justify-center py-3.75 transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                        <ThreadsIcon className="text-threads-text h-8.5 w-8.5 dark:text-white" />
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex w-15 flex-1 flex-col items-center justify-center gap-1">
                    {NAV_ITEMS.map((item, index) => {
                        let featureKey = null;
                        if (item.path === paths.home) featureKey = "home";
                        if (item.path === paths.activity)
                            featureKey = "activity";
                        if (item.path === paths.profile) featureKey = "profile";

                        return (
                            <div
                                key={index}
                                onClickCapture={(e) =>
                                    handleProtectedAction(e, item)
                                }
                                className="flex w-full items-center justify-center"
                            >
                                <NavItem
                                    {...item}
                                    onRefetch={() =>
                                        featureKey &&
                                        handleRefetchSignal(featureKey)
                                    }
                                />
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="mb-5.5 flex w-full flex-col items-center justify-center gap-1">
                    {/* Pin */}
                    {!isAuthenticated && (
                        <div
                            className="flex h-13.25 w-15 cursor-pointer items-center justify-center"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowGuestDialog(true);
                            }}
                        >
                            <PinItem />
                        </div>
                    )}

                    {/* Setting */}
                    <div className="flex h-13.25 w-full items-center justify-center">
                        <SettingsMenu align="start" side="top" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default DesktopSidebar;
