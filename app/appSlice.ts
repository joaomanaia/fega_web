import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        appThemeLight: true
    },
    reducers: {
        changeAppTheme: (state) => {
            state.appThemeLight = !state.appThemeLight
        },
        setAppThemeLight: (state) => {
            state.appThemeLight = true
        },
        setAppThemeNight: (state) => {
            state.appThemeLight = false
        },
    }
})

export const { changeAppTheme, setAppThemeLight, setAppThemeNight } = appSlice.actions

export const selectAppThemeLight = (state: RootState) => state.app.appThemeLight

export default appSlice.reducer