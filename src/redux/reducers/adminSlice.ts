import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { adminSliceType, adminSlicePayload } from "../../types/type";

const initialState: adminSliceType = {
  admin: null,
  token: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogin: (state, action: PayloadAction<adminSlicePayload>) => {
      state.admin = action.payload.email;
      state.token = action.payload.token;
    },
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
    },
  },
});

export const { adminLogin, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;