import React from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/configs/navigation";
import NavItem from "./NavItem";
import { useGuestLogin } from "@/features/auth/hooks/useGuestLogin";

function MobileNav() {
    const { handleProtectedAction } = useGuestLogin();
    return (
        <>
            <nav
                className={cn(
                    "fixed right-0 bottom-0 left-0 z-50 md:hidden",
                    "h-(--threads-bottom-nav-height)",
                    "flex items-center justify-around",
                    "bg-white/85 backdrop-blur-[20px] dark:bg-black/85",
                    "border-threads-border border-t",
                    "gap-2 px-2",
                )}
            >
                {NAV_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1"
                        onClickCapture={(e) => handleProtectedAction(e, item)}
                    >
                        <NavItem {...item} />
                    </div>
                ))}
            </nav>
        </>
    );
}

export default MobileNav;
