import React, { Fragment } from "react";
import {
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TriggerButton from "./TriggerButton";
import ActionMenuItem from "@/components/ui/ActionMenuItem";
import ActionDropdown from "@/components/ui/ActionDropdown";

// eslint-disable-next-line react/prop-types
function HeaderMoreAction({ actions = [], t }) {
    return (
        <ActionDropdown
            trigger={
                <DropdownMenuTrigger asChild>
                    <TriggerButton />
                </DropdownMenuTrigger>
            }
        >
            {actions.map((item, index) => (
                <Fragment key={index}>
                    {/* Thêm kẻ phân cách (nếu không phải item đầu tiên) */}
                    {index > 0 && (
                        <DropdownMenuSeparator className="bg-threads-border/50 -mx-2 my-1 h-[0.5px]" />
                    )}

                    {/* Item */}
                    <ActionMenuItem
                        label={t(item.labelKey)}
                        Icon={item.Icon}
                        onClick={() => console.log("Clicked:", item.action)}
                    />
                </Fragment>
            ))}
        </ActionDropdown>
    );
}

export default HeaderMoreAction;
