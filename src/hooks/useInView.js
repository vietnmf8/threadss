import { useState, useEffect, useRef } from "react";
import { VIRTUALIZATION_CONFIG } from "@/configs/constants";

/**
 * Theo dõi xem phần tử có nằm trong Viewport hoặc Vùng đệm không
 */
export function useInView() {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Phần tử chưa cần xuất hiện trên màn hình — 
        // chỉ cần cách viewport 1000px là đã tính là inView.
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            {
                rootMargin: `${VIRTUALIZATION_CONFIG.BUFFER_ZONE} 0px`,
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, []);

    return [ref, inView];
}
