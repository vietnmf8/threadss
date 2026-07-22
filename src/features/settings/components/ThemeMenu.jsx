import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import SubMenuHeader from "./SubMenuHeader";
import LightBulb from "@/components/layout/LightBulb";

/**
 * ThemeMenu: Menu chỉnh Giao diện (Sáng/Tối)
 */
const ThemeMenu = forwardRef(({ t, onBack, className }, ref) => {
    return (
        <div ref={ref} className={cn("flex w-full flex-col pb-2", className)}>
            <SubMenuHeader title={t("settings:appearance")} onBack={onBack} />

            <div className="p-4">
                <LightBulb
                    className="-top-24 left-1/2 -translate-x-1/2 translate-y-1/2"
                    width={100}
                    height={200}
                    threshold={10}
                />
            </div>
        </div>
    );
});

ThemeMenu.displayName = "ThemeMenu";
ThemeMenu.propTypes = {
    t: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default ThemeMenu;
