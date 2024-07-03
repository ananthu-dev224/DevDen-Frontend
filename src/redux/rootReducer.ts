import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";
import adminSlice from "./reducers/adminSlice";

const rootReducer = combineReducers({
    user:userSlice,
    admin:adminSlice
})

export default rootReducer;