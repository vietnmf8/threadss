import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import SettingsButton from "./SettingsButton";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import { VIEW_TYPES } from "@/configs/constants";
import { useMenuHeight } from "@/hooks/useMenuHeight";
import { useSettingsAction } from "@/features/settings/hooks/useSettingsAction";
import { useAutoCloseMenu } from "@/hooks/useAutoCloseMenu";
import { FeedMenu, MainMenu, ThemeMenu } from "@/features/settings/components";

function SettingsMenu({ align = "end", side = "bottom" }) {
    const { t } = useTranslation(["settings"]);

    /* State quản lý View & Open */
    const [view, setView] = useState(VIEW_TYPES.MAIN);
    const [isOpen, setIsOpen] = useState(false);

    /* Custom Hooks */
    const { menuHeight, refs } = useMenuHeight(isOpen, view);
    const { handleAction, handleNavigate } = useSettingsAction(setView);
    useAutoCloseMenu(isOpen, () => setIsOpen(false));

    /* Reset về Main view khi đóng menu */
    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setTimeout(() => setView(VIEW_TYPES.MAIN), 100);
        }
    };

    /* ==========================================================
     * JSX
     * ==========================================================*/
    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <SettingsButton className="h-12 w-12" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align={align}
                side={side}
                avoidCollisions={false}
                sideOffset={0}
                alignOffset={5}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className={cn(
                    "bg-threads-content-bg border-threads-border shadow-threads-dropdown overflow-hidden",
                    "min-w-60 rounded-2xl border p-0",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "transition-[height] duration-200 ease-[cubic-bezier(0.08,0.52,0.52,1)]",
                )}
                style={{ height: menuHeight ? `${menuHeight}px` : "auto" }}
            >
                <div className="relative w-full">
                    {/* VIEW 1: MAIN MENU */}
                    <MainMenu
                        ref={refs.MAIN}
                        t={t}
                        onAction={handleAction}
                        className={cn(
                            "absolute top-0 left-0 transition-transform duration-200 ease-in-out",
                            view === VIEW_TYPES.MAIN
                                ? "translate-x-0 opacity-100"
                                : "pointer-events-none -translate-x-full opacity-0",
                        )}
                    />

                    {/* VIEW 2: FEED MENU */}
                    <FeedMenu
                        ref={refs.FEED}
                        t={t}
                        onBack={() => setView(VIEW_TYPES.MAIN)}
                        onNavigate={handleNavigate}
                        className={cn(
                            "absolute top-0 left-0 transition-transform duration-200 ease-in-out",
                            view === VIEW_TYPES.FEED
                                ? "translate-x-0 opacity-100"
                                : "pointer-events-none translate-x-full opacity-0",
                        )}
                    />

                    {/* [NEW] VIEW 3: THEME MENU */}
                    <ThemeMenu
                        ref={refs.THEME}
                        t={t}
                        onBack={() => setView(VIEW_TYPES.MAIN)}
                        className={cn(
                            "absolute top-0 left-0 transition-transform duration-200 ease-in-out",
                            view === VIEW_TYPES.THEME
                                ? "translate-x-0 opacity-100"
                                : "pointer-events-none translate-x-full opacity-0",
                        )}
                    />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

SettingsMenu.propTypes = {
    align: PropTypes.oneOf(["start", "center", "end"]),
    side: PropTypes.oneOf(["top", "right", "bottom", "left"]),
};

export default SettingsMenu;
