import React, { useState } from "react";
import { Outlet } from "react-router";
import { cn } from "@/lib/utils";
import AuthFooter from "@/components/layout/AuthFooter";
import LoginQRCode from "@/features/auth/components/LoginQRCode";
import { ThreadsIcon } from "@/assets/icons";

function AuthLayout() {
    /* State để quản lý việc ẩn/hiện QR Code từ các trang con */
    // VD: RegisterSuccess muốn ẩn
    const [isQRCodeHidden, setIsQRCodeHidden] = useState(false);

    const BANNER_CLASSES = cn(
        "pointer-events-none absolute top-0 left-1/2 h-127.5 w-446.25 max-w-none -translate-x-1/2 object-cover opacity-100 ",
        "[@media(max-height:860px)]:mt-[calc(100vh-860px)]",
    );

    return (
        <div className="bg-threads-auth-bg relative z-0 flex min-h-screen flex-col">
            <LoginQRCode className={cn(isQRCodeHidden && "hidden")} />

            <div className="relative flex w-full grow flex-col items-center justify-center overflow-hidden">
                {/* Banner Image */}
                <div className="z-0 flex w-full justify-center">
                    <picture>
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v4/ym/r/_qas8NM9G0b.png"
                            alt="Threads Ribbon Light"
                            className={cn(
                                BANNER_CLASSES,
                                "hidden min-[520px]:block dark:hidden",
                            )}
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <img
                            src="https://static.cdninstagram.com/rsrc.php/v4/y_/r/tRm8c5IuJJa.png"
                            alt="Threads Ribbon Dark"
                            className={cn(
                                BANNER_CLASSES,
                                "hidden dark:min-[520px]:block",
                            )}
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </picture>
                </div>

                {/* Logo Mobile */}
                <div className="min-[520px]:hidden">
                    <ThreadsIcon className="text-threads-text h-15 w-15 cursor-pointer" />
                </div>

                {/* Main Content (Form) */}
                <div className="z-10 mb-13 box-content w-full max-w-92.5 p-6 min-[520px]:mt-[20vh]">
                    {/* Truyền dữ liệu xuống các Route con */}
                    <Outlet context={{ setIsQRCodeHidden }} />
                </div>
            </div>

            {/* 5. Footer */}
            <div className="absolute bottom-0 mt-auto w-full">
                <AuthFooter />
            </div>
        </div>
    );
}

export default AuthLayout;
