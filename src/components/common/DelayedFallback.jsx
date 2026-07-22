import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DelayedFallback = ({ children, delay = 1000 }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return show ? children : null;
};

DelayedFallback.propTypes = {
    children: PropTypes.node.isRequired,
    delay: PropTypes.number,
};

export default DelayedFallback;
