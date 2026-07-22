import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import appReducer from "@/features/app/appSlice";
import postReducer from "@/features/post/postSlice";
import { authApi } from "./services/auth";
import { postApi } from "./services/post";

const store = configureStore({
    reducer: {
        auth: authReducer,
        app: appReducer,
        post: postReducer,
        [authApi.reducerPath]: authApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware({
            serializableCheck: false,
        }),
        authApi.middleware,
        postApi.middleware,
    ],
});

window.store = store;

export { store };
