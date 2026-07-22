import PostCard from "@/features/post/components/PostCard";
import { useHomeFeed } from "@/features/post/hooks/useHomeFeed";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FeedLoading from "./FeedLoading";
import GhostEmptyState from "./GhostEmptyState";
import FeedSkeleton from "./FeedSkeleton";
import RefetchLoading from "./RefetchLoading";
import PostInput from "./PostInput";
import PropTypes from "prop-types";
import VirtualizedItem from "@/components/common/VirtualizedItem";

function FeedList({ type, isActive }) {
    const { t } = useTranslation(["home"]);

    const {
        feedData,
        isLoading,
        isFetching,
        isManualRefetching,
        isError,
        isGhostTab,
        isAuthenticated,
        hasData,
        sentryRef,
        hasMore,
        isInitialized,
    } = useHomeFeed(type);

    /* Render Post */
    const renderedPosts = useMemo(() => {
        if (!hasData) return null;
        return feedData.map((post) => (
            <VirtualizedItem key={post.id} id={post.id} isActiveTab={isActive}>
                <PostCard post={post} />
            </VirtualizedItem>
        ));
    }, [feedData, hasData, isActive]);

    /* Render Content */
    const renderContent = () => {
        // Trạng thái Loading lần đầu (Skeleton)
        if (isLoading) return <FeedSkeleton />;

        // Trạng thái lỗi API
        if (isError) {
            return (
                <div className="py-10 text-center text-red-500">
                    {t("home:feed_load_error")}
                </div>
            );
        }

        // Trạng thái không có dữ liệu (Empty State)
        if (isInitialized && !isFetching && !hasData) {
            if (isGhostTab) return <GhostEmptyState />;
            return (
                <div className="text-threads-dim p-4 text-center text-sm">
                    {t("home:feed_empty")}
                </div>
            );
        }

        // Render danh sách bài viết
        return (
            <div className="relative flex flex-col">
                {renderedPosts}

                {/* Loading khi cuộn vô hạn */}
                <FeedLoading
                    ref={sentryRef}
                    isFetching={isFetching}
                    hasMore={hasMore}
                />
            </div>
        );
    };

    return (
        <>
            {/* Ô nhập bài viết mới (Hiển thị cho user đã đăng nhập) */}
            {isAuthenticated && !isGhostTab && <PostInput />}

            {/* Khối loading khi làm mới dữ liệu tại đỉnh trang */}
            <RefetchLoading isVisible={isManualRefetching} />

            {/* Danh sách bài viết hoặc các trạng thái khác */}
            {renderContent()}
        </>
    );
}

FeedList.propTypes = {
    type: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
};

export default FeedList;
