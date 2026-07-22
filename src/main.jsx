import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import App from "./App.jsx";
import React, { Suspense } from "react";
import { store } from "./store";
import "./utils/i18n";
import DelayedFallback from "./components/common/DelayedFallback";
import Loading from "./components/common/Loading";
import * as Sentry from "@sentry/react";
import { ThemeProvider } from "@/contexts/ThemeContext";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [
        Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
        }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
        <ThemeProvider>
            <Suspense
                fallback={
                    <DelayedFallback delay={1000}>
                        <Loading />
                    </DelayedFallback>
                }
            >
                <App />
            </Suspense>
        </ThemeProvider>
    </ReduxProvider>,
);
