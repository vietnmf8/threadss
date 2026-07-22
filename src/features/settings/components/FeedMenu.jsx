import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { FEED_TABS } from "@/configs/feedTabs";
import { AddNewFeedIcon } from "@/assets/icons";
import MenuItem from "./MenuItem";
import SubMenuHeader from "./SubMenuHeader";

/**
 * FeedMenu: Menu chọn Feed (For you, Following...)
 */
const FeedMenu = forwardRef(({ t, onBack, onNavigate, className }, ref) => {
    return (
        <div ref={ref} className={cn("flex w-full flex-col pb-2", className)}>
            <SubMenuHeader
                title={t("settings:feed")}
                onBack={onBack}
                rightAction={
                    <AddNewFeedIcon className="text-threads-text size-5" />
                }
            />

            <div className="p-2">
                {FEED_TABS.map((tab, index) => (
                    <MenuItem
                        key={tab.id || index}
                        label={t(`home:${tab.labelKey}`)}
                        icon={tab.Icon}
                        onClick={() => onNavigate(tab.path)}
                    />
                ))}
            </div>
        </div>
    );
});

FeedMenu.displayName = "FeedMenu";
FeedMenu.propTypes = {
    t: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default FeedMenu;
