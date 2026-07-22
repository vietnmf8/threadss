import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router";
import React, { Fragment, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import SplashScreen from "@/components/common/SplashScreen.jsx";
import { SPLASH_PATHS } from "@/configs/path.js";
import routes from "./routes";
import Private from "./components/common/Private";
import { Toaster } from "react-hot-toast";

function AppContent() {
    const location = useLocation();
    const { isSplashFinished } = useSelector((state) => state.app);

    // Kiểm tra path hiện tại có nằm trong danh sách được hiện Splash không
    const isAllowedPath = SPLASH_PATHS.includes(location.pathname);

    /* Thiết lập chế độ cuộn thủ công */
    useEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    return (
        <>
            {/* Splash Screen */}
            <AnimatePresence mode="wait">
                {!isSplashFinished && isAllowedPath && (
                    <SplashScreen key="splash" />
                )}
            </AnimatePresence>

            <Routes location={location}>
                {routes.map((route, index) => {
                    const Layout = route.layout;
                    return (
                        <Route key={index} element={<Layout />}>
                            {route.children.map((child, index) => {
                                const Component = child.component;
                                const Wrapper = child.private
                                    ? Private
                                    : Fragment;
                                return (
                                    <Route
                                        key={index}
                                        path={child.path}
                                        element={
                                            <Wrapper>
                                                <Component />
                                            </Wrapper>
                                        }
                                    />
                                );
                            })}
                        </Route>
                    );
                })}
            </Routes>
            <Toaster />
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
