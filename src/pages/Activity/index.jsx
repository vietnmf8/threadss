import React from "react";
import FeedHeader from "../../layouts/common/FeedHeader";
import FeedContent from "../../layouts/common/FeedContent";
import FeedSkeleton from "@/pages/Home/components/FeedSkeleton";
import { useMeQuery } from "@/services/auth";
import RefetchLoading from "@/pages/Home/components/RefetchLoading";
import { useDispatch } from "react-redux";
import { emitRefetchSignal } from "@/features/app/appSlice";
import { useRefetchSignal } from "@/hooks/useRefetchSignal";

function Activity() {
    const dispatch = useDispatch();

    /* Gọi API lấy dữ liệu Activity */
    const { isLoading, refetch, isFetching } = useMeQuery(undefined, {
        refetchOnMountOrArgChange: false, // Không tự ý refetch khi mount
    });

    useRefetchSignal("activity", refetch);

    return (
        <>
            <FeedHeader
                onRefetch={() => dispatch(emitRefetchSignal("activity"))}
                isFetching={isFetching}
            />
            <FeedContent>
                <RefetchLoading
                    isVisible={isFetching && !isLoading && window.scrollY === 0}
                />

                {isLoading ? (
                    <FeedSkeleton />
                ) : (
                    <div className="text-threads-dim p-4 text-center text-sm">
                        Activity Content Placeholder
                    </div>
                )}
            </FeedContent>
        </>
    );
}

export default Activity;
