import React from "react";
import { useTranslation } from "react-i18next";
import { FOOTER_LINKS } from "@/configs/footerConfig";
import { cn } from "@/lib/utils";

function AuthFooter() {
    const { t } = useTranslation(["auth"]);

    return (
        <footer className="flex h-17.5 w-full items-center justify-center bg-transparent px-4 text-center">
            <ul className="flex flex-wrap justify-center gap-x-4">
                {FOOTER_LINKS.map((link, index) => (
                    <li key={link.key}>
                        {index === 0 ? (
                            /* Text (Copyright) */
                            <span className="text-threads-dim text-[12px]">
                                {t(`auth:${link.key}`)}
                            </span>
                        ) : (
                            /* Các item còn lại: Link */
                            <a
                                href={link.href}
                                className={cn(
                                    "text-threads-dim decoration-threads-dim text-[12px] hover:underline",
                                    "transition-all",
                                )}
                            >
                                {t(`auth:${link.key}`)}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </footer>
    );
}

export default AuthFooter;
