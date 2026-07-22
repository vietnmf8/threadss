import React from "react";
import { cn } from "@/lib/utils";
import paths from "@/configs/path";
import { Link } from "react-router";
import { ThreadsIcon } from "@/assets/icons";
import SettingsMenu from "./SettingsMenu";
import { useSelector } from "react-redux";
import LoginButton from "./LoginButton";

function MobileHeader() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <header
            className={cn(
                "fixed top-0 right-0 left-0 z-50 md:hidden",
                "flex h-(--threads-header-height) items-center justify-center",
                "dark:bg-threads-content-bg bg-white/85 backdrop-blur-[20px]",
                "px-4 transition-transform duration-300",
            )}
        >
            {/* Logo */}
            <Link
                to={paths.home}
                className="flex items-center justify-center transition-transform active:scale-95"
            >
                <ThreadsIcon className="text-threads-text h-8 w-8 dark:text-white" />
            </Link>

            {/* Button Setting */}
            <div className="absolute top-1/2 right-3.25 -translate-y-1/2">
                {!isAuthenticated ? (
                    <LoginButton />
                ) : (
                    <div className="scale-x-[-1]">
                        <SettingsMenu align="end" side="bottom" />
                    </div>
                )}
            </div>
        </header>
    );
}

export default MobileHeader;
