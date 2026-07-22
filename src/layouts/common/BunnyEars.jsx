import React from "react";

function BunnyEars() {
    return (
        <>
            <div className="absolute top-11.75 -left-3 z-2 h-9 w-9 overflow-hidden">
                <div className="border-threads-feed-header-border shadow-threads-feed-header absolute right-0 bottom-0 h-12 w-12 translate-x-1/2 translate-y-1/2 rounded-3xl border bg-transparent" />
            </div>
            <div className="border-b-threads-border absolute top-11.75 z-1 box-content h-3 w-[calc(100%-46px)] overflow-y-hidden border-b">
                <div className="relative top-full h-full w-full shadow-(--shadow-threads-feed)"></div>
            </div>
            <div className="absolute top-11.75 -right-3 z-2 h-9 w-9 overflow-hidden">
                <div className="border-threads-feed-header-border shadow-threads-feed-header absolute bottom-0 left-0 h-12 w-12 -translate-x-1/2 translate-y-1/2 rounded-3xl border bg-transparent" />
            </div>
        </>
    );
}

export default BunnyEars;
