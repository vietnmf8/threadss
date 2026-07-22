import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useDebounce from "./useDebounce";

/**
 * Custom Hook chuyên dụng để lắng nghe tín hiệu refetch từ Redux.
 */
export function useRefetchSignal(featureKey, refetchFn, condition = true) {
    const { refetchSignals } = useSelector((state) => state.app);
    const signal = refetchSignals[featureKey] || 0;
    const debouncedSignal = useDebounce(signal, 300);

    // Lưu trữ giá trị signal ban đầu khi component được tạo ra
    const initialSignalRef = useRef(signal);
    const refetchRef = useRef(refetchFn);

    useEffect(() => {
        refetchRef.current = refetchFn;
    }, [refetchFn]);

    useEffect(() => {
        if (debouncedSignal > initialSignalRef.current) {
            if (condition) {
                refetchRef.current();
            }

            initialSignalRef.current = debouncedSignal;
        }
    }, [debouncedSignal, condition]);
}
