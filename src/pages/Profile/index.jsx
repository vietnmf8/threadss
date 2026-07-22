import React from "react";
import FeedHeader from "../../layouts/common/FeedHeader";
import FeedContent from "../../layouts/common/FeedContent";
import Loading from "@/components/common/Loading";
import { useMeQuery } from "@/services/auth";
import RefetchLoading from "@/pages/Home/components/RefetchLoading";
import { useDispatch } from "react-redux";
import { emitRefetchSignal } from "@/features/app/appSlice";
import { useRefetchSignal } from "@/hooks/useRefetchSignal";

function Profile() {
    const dispatch = useDispatch();
    const {
        data: user,
        isLoading,
        refetch,
        isFetching,
    } = useMeQuery(undefined, {
        refetchOnMountOrArgChange: false,
    });

    useRefetchSignal("profile", refetch);

    return (
        <>
            <FeedHeader
                onRefetch={() => dispatch(emitRefetchSignal("profile"))}
                isFetching={isFetching}
            />
            <FeedContent>
                <RefetchLoading
                    isVisible={isFetching && !isLoading && window.scrollY === 0}
                />

                {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loading />
                    </div>
                ) : (
                    <div className="text-threads-dim p-4 text-center text-sm">
                        {user
                            ? `Profile của ${user.username}`
                            : "Profile Content Placeholder"}
                    </div>
                )}
            </FeedContent>
        </>
    );
}

export default Profile;
