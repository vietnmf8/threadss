import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { LogoIcon, MetaIcon } from "@/assets/icons";
import { useDispatch } from "react-redux";
import { setSplashFinished } from "@/features/app/appSlice";

const SplashScreen = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Đánh dấu kết thúc Splash
        const timer = setTimeout(() => {
            dispatch(setSplashFinished(true));
        }, 500); //800

        return () => clearTimeout(timer);
    }, [dispatch]);

    /* Logic khóa cuộn Body/Html */
    useEffect(() => {
        // Thêm class khóa cuộn khi component mount
        document.body.classList.add("no-scroll");
        document.documentElement.classList.add("no-scroll");

        // Gỡ bỏ class khóa cuộn khi component unmount
        return () => {
            document.body.classList.remove("no-scroll");
            document.documentElement.classList.remove("no-scroll");
        };
    }, []);

    return (
        <motion.div
            className="bg-threads-bg fixed inset-0 z-999 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Logo Threads */}
            <motion.div
                className="text-threads-icon-fill absolute top-[calc(48vh-46px)] left-[calc(50vw-40px)] h-23.25 w-20.25"
                initial={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <LogoIcon className="h-full w-full text-current" />
            </motion.div>

            {/* Logo Meta */}
            <motion.div
                className="text-threads-icon-fill absolute bottom-5 left-[calc(50vw-53px)] h-17.25 w-26.5"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <MetaIcon className="h-full w-full text-current" />
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
