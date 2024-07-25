import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./src/features/sidebar/sidebarSlice";

export default configureStore({
    reducer: {
        sidebar: sidebarReducer,
    }
})