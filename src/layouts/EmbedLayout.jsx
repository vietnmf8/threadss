import React from "react";
import { Outlet } from "react-router";

/**
 * Layout Embed đơn giản dành riêng cho việc nhúng Iframe vào các trang web bên ngoài.
 * Không chứa Sidebar, Navigation Bar, Footer hay LoginPanel.
 */
function EmbedLayout() {
    return (
        <div className="min-h-screen w-full bg-threads-bg text-threads-text flex items-center justify-center p-2 sm:p-4 selection:bg-threads-hover">
            <main className="w-full max-w-[540px]">
                <Outlet />
            </main>
        </div>
    );
}

export default EmbedLayout;
