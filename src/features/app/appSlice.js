import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSplashFinished: false,

    /* Quản lý tín hiệu refetch */
    refetchSignals: {
        home: 0,
        activity: 0,
        profile: 0,
    },
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setSplashFinished: (state, action) => {
            state.isSplashFinished = action.payload;
        },
        resetSplash: (state) => {
            state.isSplashFinished = false;
        },
        emitRefetchSignal: (state, action) => {
            const feature = action.payload;
            if (state.refetchSignals[feature] !== undefined) {
                state.refetchSignals[feature] += 1;
            }
        },
    },
});

export const { setSplashFinished, resetSplash, emitRefetchSignal } =
    appSlice.actions;
export default appSlice.reducer;
