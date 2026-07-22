import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import Loading from "@/components/common/Loading";

/**
 * Khối Refetch Loading
 * Hiển thị khi người dùng làm mới dữ liệu tại đỉnh trang.
 * Áp dụng hiệu ứng đẩy nội dung xuống
 */

const RefetchLoading = ({ isVisible }) => {
    return (
        <div
            className={cn(
                "w-full overflow-hidden transition-all duration-300 ease-in-out",
                isVisible ? "h-21 opacity-100" : "h-0 opacity-0",
            )}
        >
            <div className="flex h-21 items-center justify-center">
                <Loading className="h-6 w-6" />
            </div>
        </div>
    );
};

RefetchLoading.propTypes = {
    isVisible: PropTypes.bool,
};

export default RefetchLoading;
