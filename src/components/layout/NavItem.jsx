import { PROTECTED_PATHS } from "@/configs/constants";
import paths from "@/configs/path";
import { useSmartNavigate } from "@/hooks/useSmartNavigate";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router";

function NavItem({
    path,
    icon: Icon,
    activeIcon: ActiveIcon,
    title,
    isCreate,
    className,
    activePaths,
    onRefetch,
    isFetching,
}) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { handleSmartClick } = useSmartNavigate();

    /* Xác định [active] NavItem */
    let isActive = false;
    if (activePaths && activePaths.length > 0) {
        isActive = activePaths.includes(pathname);
    } else if (path === "/") {
        isActive = pathname === "/";
    } else if (path) {
        isActive = pathname.startsWith(path);
    }

    /* Xác định UI Icon đang được Active */
    const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

    /* Xử lý Click  */
    const handleClick = (e) => {
        e.preventDefault();

        // Điều hướng thông minh
        handleSmartClick(e, path, { onRefetch, isFetching });
        if (pathname === path) return;

        if (isCreate) {
            // todos: Mở modal
            console.log("Open Create Modal");
            return;
        }
        const isProtected = PROTECTED_PATHS.includes(path);
        const hasToken = !!localStorage.getItem("accessToken");

        if (isProtected && !hasToken) {
            navigate(paths.login);
            return;
        }

        navigate(path);
    };

    return (
        <div className="group relative flex h-15 w-full items-center justify-center">
            <div
                className={cn(
                    "ease-spring absolute h-12 w-full rounded-xl transition-all duration-300",
                    "bg-threads-nav-hover-bg",
                    isCreate
                        ? "opacity-100"
                        : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                    isActive && !isCreate ? "opacity-0" : "",
                    "group-active:scale-90",
                )}
            ></div>

            <Link
                to={path || "#"}
                onClick={handleClick}
                className={cn(
                    "z-10 flex h-full w-full items-center justify-center",
                    "transition-transform duration-200 group-active:scale-90",
                )}
                title={title}
            >
                <DisplayIcon
                    className={cn(
                        "transition-colors duration-200",
                        isActive
                            ? "text-threads-nav-icon-active"
                            : "text-threads-nav-icon-default",
                        isCreate && "group-hover:text-threads-nav-icon-active",
                        className || "h-6 w-6",
                    )}
                />
            </Link>
        </div>
    );
}

/* PropTypes */
NavItem.propTypes = {
    path: PropTypes.string,
    icon: PropTypes.elementType.isRequired,
    activeIcon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    isCreate: PropTypes.bool,
    className: PropTypes.string,
    activePaths: PropTypes.arrayOf(PropTypes.string),
    onRefetch: PropTypes.func,
    isFetching: PropTypes.bool,
};

export default NavItem;
