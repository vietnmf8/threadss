import { useState, useLayoutEffect, useRef } from "react";

export function useMenuHeight(isOpen, view) {
    const [menuHeight, setMenuHeight] = useState(null);
    const refs = {
        MAIN: useRef(null),
        FEED: useRef(null),
        THEME: useRef(null),
    };

    useLayoutEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                const currentRef = refs[view]?.current;
                if (currentRef) {
                    setMenuHeight(currentRef.offsetHeight);
                }
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setMenuHeight(null), 200);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, isOpen]);

    return { menuHeight, refs, setMenuHeight };
}
