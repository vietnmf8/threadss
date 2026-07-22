import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* Component hiển thị số lượng với hiệu ứng "Mechanical Roll" chuẩn Threads. */
const Counter = memo(({ count, className }) => {
    const [displayCount, setDisplayCount] = useState(count);
    const [direction, setDirection] = useState(1); // 1: tăng, -1: giảm
    const prevCountRef = useRef(count);

    useEffect(() => {
        if (count !== prevCountRef.current) {
            // Xác định hướng trượt trước khi cập nhật displayCount
            const newDir = count > prevCountRef.current ? 1 : -1;
            setDirection(newDir);
            setDisplayCount(count);
            prevCountRef.current = count;
        }
    }, [count]);

    const variants = useMemo(
        () => ({
            initial: (dir) => ({
                y: dir > 0 ? "50%" : "-50%",
                scaleY: 0.5,
                opacity: 0,
            }),
            animate: {
                y: "0%",
                scaleY: 1,
                opacity: 1,
            },
            exit: (dir) => ({
                y: dir > 0 ? "-50%" : "50%",
                scaleY: 0.5,
                opacity: 0,
            }),
        }),
        [],
    );

    if (!count || count === 0) return null;

    return (
        <div className="relative flex h-4.5 items-center justify-start overflow-hidden">
            <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
            >
                <motion.span
                    key={displayCount}
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                        duration: 0.6,
                        ease: [0.32, 0.72, 0, 1],
                        opacity: { duration: 0.2 },
                    }}
                    style={{
                        // Tăng: số mới trồi lên từ Bottom (100%).
                        // Giảm: số mới rơi xuống từ Top (0%)
                        transformOrigin: direction > 0 ? "50% 80%" : "50% 0%",
                        display: "inline-block",
                        willChange: "transform, opacity",
                    }}
                    className={cn("select-none", className)}
                >
                    {displayCount}
                </motion.span>
            </AnimatePresence>
        </div>
    );
});
Counter.displayName = "Counter";
Counter.propTypes = {
    count: PropTypes.number,
    className: PropTypes.string,
};

export default Counter;
