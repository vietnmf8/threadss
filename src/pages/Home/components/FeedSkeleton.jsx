import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

function FeedSkeleton() {
    const ITEMS_COUNT = 15;

    // Cấu hình 3 biến thể độ dài
    const VARIANTS = [
        { username: "w-[87px]", line1: "w-[86%]", line2: "w-[64%]" },
        { username: "w-[120px]", line1: "w-[94%]", line2: "w-[72%]" },
        { username: "w-[60px]", line1: "w-[70%]", line2: "w-[40%]" },
    ];

    return (
        <div className="flex flex-col gap-y-12 px-6 py-4">
            {Array(ITEMS_COUNT)
                .fill(0)
                .map((_, index) => {
                    // Chọn variant theo chu kỳ 3
                    const variant = VARIANTS[index % 3];

                    return (
                        <div
                            key={index}
                            className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3"
                        >
                            {/* Avatar */}
                            <div>
                                <Skeleton className="h-9 w-9 rounded-[18px]" />
                            </div>

                            {/* Content */}
                            <div>
                                {/* Line 1 */}
                                <div className={variant.username}>
                                    <Skeleton className="h-3.75 w-full rounded-[6px]" />
                                </div>

                                {/*  Line 2 */}
                                <div className={variant.line1}>
                                    <Skeleton className="mt-1.5 h-3.75 w-full rounded-[6px]" />
                                </div>

                                {/*  Line 3 */}
                                <div className={variant.line2}>
                                    <Skeleton className="mt-1.5 h-3.75 w-full rounded-[6px]" />
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default FeedSkeleton;
