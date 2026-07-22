import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { LoadingIcon } from "@/assets/icons";
import { useTranslation } from "react-i18next";

/**
 * Component hiển thị trạng thái loading ở cuối danh sách feed
 */
const FeedLoading = forwardRef(({ isFetching, hasMore }, ref) => {
    const { t } = useTranslation(["home"]);
    return (
        <div ref={ref} className="flex w-full items-center justify-center py-8">
            {/* Chỉ hiển thị icon loading khi  đang fetch và vẫn còn dữ liệu */}
            {isFetching && hasMore && (
                <LoadingIcon className="text-threads-dim h-5 w-5 animate-[spin_1s_steps(8,end)_infinite]" />
            )}

            {/* Hiển thị thông báo khi hết bài viết */}
            {!hasMore && (
                <div className="text-threads-dim text-xs">
                    {t("home:feed_end")}
                </div>
            )}
        </div>
    );
});

FeedLoading.displayName = "FeedLoading";

FeedLoading.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
};

export default FeedLoading;
