// File: src/pages/Home/components/GhostEmptyState.jsx
import { GhostPostsIcon } from "@/assets/icons";
import React from "react";
import { useTranslation } from "react-i18next";

function GhostEmptyState() {
    const { t } = useTranslation(["home"]);

    return (
        <div className="flex h-full min-h-0 w-full grow flex-col overflow-x-hidden">
            <div className="relative flex h-full w-full grow flex-col">
                <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                    <div className="text-threads-dim relative">
                        <GhostPostsIcon className="h-16 w-16" />
                    </div>

                    <span className="text-threads-dim mt-5 max-w-full min-w-0 text-2xl leading-[33.6px] font-bold text-balance wrap-break-word">
                        {t("ghost_empty_title")}
                    </span>

                    <span className="text-threads-dim mt-4 max-w-full min-w-0 text-[15px] leading-5.25 font-normal text-balance wrap-break-word">
                        {t("ghost_empty_desc")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default GhostEmptyState;
