import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { SETTINGS_GROUPS } from "@/configs/settingsMenu";
import { ACTION_TYPES } from "@/configs/constants";
import { NextIcon } from "@/assets/icons";
import MenuItem from "./MenuItem";

/**
 * MainMenu: Hiển thị danh sách chính
 */
const MainMenu = forwardRef(({ t, onAction, className }, ref) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    /* Chọn các item khi: ĐÃ ĐĂNG NHẬP / KHÁCH */
    const filteredGroups = SETTINGS_GROUPS.map((group) =>
        group.filter((item) => isAuthenticated || item.guestAllowed),
    ).filter((group) => group.length > 0);

    return (
        <div ref={ref} className={cn("w-full", className)}>
            {filteredGroups.map((group, groupIndex) => (
                <div
                    key={groupIndex}
                    className={cn(
                        "p-2",
                        groupIndex !== filteredGroups.length - 1 &&
                            "border-threads-border border-b",
                    )}
                >
                    {group.map((item, itemIndex) => (
                        <MenuItem
                            key={itemIndex}
                            label={t(item.labelKey)}
                            variant={item.variant}
                            rightIcon={
                                item.icon === "next" ? NextIcon : undefined
                            }
                            onClick={(e) => {
                                if (item.action === ACTION_TYPES.NAVIGATE) {
                                    e.preventDefault();
                                }
                                onAction(item);
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
});

MainMenu.displayName = "MainMenu";
MainMenu.propTypes = {
    t: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default MainMenu;
