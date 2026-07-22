/* eslint-disable react/prop-types */
import React, { useId } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import useTheme from "@/hooks/useTheme";

function LightBulb({
    className,
    width = 60,
    height = 120,
    threshold = 40,
    stiffness = 400,
    damping = 40,
    elastic = 1,
    ...props
}) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const clipPathId = useId();
    const VIEWBOX_HEIGHT = 481.081;
    const KNOB_START_Y = 340;
    const CENTER_X = 98.7255;
    const KNOB_POSITION_PERCENT = (KNOB_START_Y / VIEWBOX_HEIGHT) * 100;
    const scaleRatio = VIEWBOX_HEIGHT / height;
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX1 = useSpring(x, {
        stiffness: 150,
        damping: 3,
        mass: 1.2,
    });
    const springX2 = useSpring(x, {
        stiffness: 300,
        damping: 5,
        mass: 1,
    });
    const springY = useSpring(y, {
        stiffness: 600,
        damping: 10,
    });

    const cordPath = useTransform(
        [x, springY, springX1, springX2],
        ([latestX, latestY, valX1, valX2]) => {
            const svgShiftX = latestX * scaleRatio;
            const svgShiftY = latestY * scaleRatio;
            const svgSpringX1 = valX1 * scaleRatio;
            const svgSpringX2 = valX2 * scaleRatio;
            const startX = CENTER_X;
            const startY = 227.546;
            const endX = CENTER_X + svgShiftX;
            const endY = KNOB_START_Y + svgShiftY;
            const c1X = startX + svgSpringX1;
            const c1Y = startY + (endY - startY) * 0.33;
            const c2X = startX + svgSpringX2;
            const c2Y = startY + (endY - startY) * 0.66;
            return `M${startX},${startY} C${c1X},${c1Y} ${c2X},${c2Y} ${endX},${endY}`;
        },
    );
    const knobCx = useTransform(
        x,
        (latestX) => CENTER_X + latestX * scaleRatio,
    );
    const knobCy = useTransform(
        springY,
        (latestY) => KNOB_START_Y + latestY * scaleRatio,
    );
    const handleDragEnd = () => {
        const distance = Math.sqrt(x.get() ** 2 + y.get() ** 2);
        if (distance > threshold) {
            toggleTheme();
        }
    };
    const stopPropagation = (e) => {
        e.stopPropagation();
    };
    const borderClass = "text-threads-dim";
    return (
        <div
            className={cn(
                "relative z-50 flex justify-center select-none",
                className,
            )}
            style={{ width, height }}
            onClick={stopPropagation}
            onPointerDown={stopPropagation}
            {...props}
        >
            <motion.svg
                className="pointer-events-none h-full w-full overflow-visible"
                viewBox="0 0 197.451 481.081"
                initial={false}
            >
                <defs>
                    <clipPath id={clipPathId}>
                        <path d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z" />
                    </clipPath>
                </defs>

                {/* Dây kéo */}
                <motion.path
                    d={cordPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className={borderClass}
                />

                {/* Bóng đèn */}
                <g transform="translate(844.069 -645.213)">
                    <path
                        className="fill-neutral-400 dark:fill-neutral-600"
                        d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
                        stroke="none"
                    />
                    <path
                        d="M-778.379 802.873h25.512v118.409h-25.512z"
                        transform="matrix(.52452 0 0 .90177 -368.282 82.976)"
                        clipPath={`url(#${clipPathId})`}
                        fill="white"
                        fillOpacity={isDark ? 0.3 : 0.5}
                    />
                    <path
                        className={cn(
                            "fill-neutral-400 dark:fill-neutral-600",
                            borderClass,
                        )}
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v0s-8.439 10.115-28.817 10.115c-21.673 0-29.59-10.115-29.59-10.115z"
                    />
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M-774.546 827.629s12.917-13.473 29.203-13.412c16.53.062 29.203 13.412 29.203 13.412v53.6s-8.825 16-29.203 16c-21.674 0-29.203-16-29.203-16z"
                        className={borderClass}
                    />
                    <motion.path
                        d="M-783.192 803.855c5.251 8.815 5.295 21.32 13.272 27.774 12.299 8.045 36.46 8.115 49.127 0 7.976-6.454 8.022-18.96 13.273-27.774 3.992-6.7 14.408-19.811 14.408-19.811 8.276-11.539 12.769-24.594 12.769-38.699 0-35.898-29.102-65-65-65-35.899 0-65 29.102-65 65 0 13.667 4.217 26.348 12.405 38.2 0 0 10.754 13.61 14.746 20.31z"
                        initial={false}
                        animate={{
                            fill: isDark ? "#FDE047" : "#E5E7EB", // 999999
                            stroke: isDark ? "#EAB308" : "#999999",
                            fillOpacity: isDark ? 0.7 : 0.3,
                            filter: isDark
                                ? "drop-shadow(0px 0px 34px rgba(253, 224, 71, 0.6))"
                                : "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))",
                        }}
                        transition={{ duration: 0.3 }}
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <path
                        d="M-789.19 757.501a45.897 45.897 0 013.915-36.189 45.897 45.897 0 0129.031-21.957"
                        fill="none"
                        stroke="white"
                        strokeWidth="15"
                        strokeLinecap="round"
                        opacity={isDark ? 0.4 : 0.8}
                    />
                    <g
                        fill="none"
                        stroke={isDark ? "#CA8A04" : "#9CA3AF"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity={isDark ? 0.5 : 0.5}
                    >
                        <path d="M-752.914 823.875l-8.858-33.06" />
                        <path d="M-737.772 823.875l8.858-33.06" />
                    </g>
                </g>

                {/* NÚM TRÒN */}
                <motion.circle
                    cx={knobCx}
                    cy={knobCy}
                    r="6"
                    className="fill-threads-dim"
                />
            </motion.svg>

            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: `${KNOB_POSITION_PERCENT}%` }}
            >
                <motion.div
                    drag
                    dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                    dragElastic={elastic}
                    dragTransition={{
                        bounceStiffness: stiffness,
                        bounceDamping: damping,
                    }}
                    style={{ x, y }}
                    onDragEnd={handleDragEnd}
                    onPointerDown={stopPropagation}
                    onClick={stopPropagation}
                    className="relative cursor-grab touch-none active:cursor-grabbing"
                >
                    {/* Hit Area */}
                    <div className="absolute -top-10 left-1/2 h-48 w-24 -translate-x-1/2 rounded-full bg-transparent" />
                </motion.div>
            </div>
        </div>
    );
}

export default LightBulb;
