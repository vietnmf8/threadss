import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { QRDarkIcon, QRLightIcon } from "@/assets/icons";
import PropTypes from "prop-types";

function LoginQRCode({ className }) {
    const { t } = useTranslation(["auth"]);

    return (
        <div
            className={cn(
                "fixed z-10 flex flex-col items-center justify-center transition-opacity duration-200",
                "hidden min-[768px]:flex",
                "min-[768px]:right-6 min-[768px]:bottom-6 min-[768px]:h-30 min-[768px]:w-30",
                "min-[956px]:right-6 min-[956px]:bottom-6 min-[956px]:h-35 min-[956px]:w-35",
                "min-[1100px]:right-8 min-[1100px]:bottom-8",
                "min-[1200px]:h-43.5 min-[1200px]:w-43.5",
                className,
            )}
        >
            {/* Text */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-threads-dim block text-[13px] font-normal">
                    {t("auth:scan_qr_text")}
                </span>
            </div>

            {/* QR */}
            <div
                className={cn(
                    "flex h-full w-full items-center justify-center",
                    "bg-threads-content-bg border-threads-border shadow-threads-dropdown border",
                    "cursor-pointer rounded-2xl",
                    "ease-spring transition-transform duration-300 hover:scale-105 active:scale-95",
                )}
            >
                {/* Image */}
                <div
                    className={cn(
                        "flex items-center justify-center",
                        "min-[768px]:h-21.5 min-[768px]:w-21.5",
                        "min-[956px]:h-26.5 min-[956px]:w-26.5",
                        "min-[1200px]:h-35.25 min-[1200px]:w-35.25",
                    )}
                >
                    <img
                        src={QRLightIcon}
                        alt="Scan QR Code"
                        className="h-full w-full object-contain dark:hidden"
                        draggable="false"
                    />

                    <img
                        src={QRDarkIcon}
                        alt="Scan QR Code"
                        className="hidden h-full w-full object-contain dark:block"
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    );
}

LoginQRCode.propTypes = {
    className: PropTypes.string,
};

export default LoginQRCode;
