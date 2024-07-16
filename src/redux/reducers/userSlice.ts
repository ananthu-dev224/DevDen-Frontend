import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userSlicePayload, userSliceType , editProfilePayload} from "../../types/type";

const initialState: userSliceType = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<{ user:userSlicePayload , token : string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    userLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    editProfile: (state, action: PayloadAction<{ user:editProfilePayload}>) => {
      state.user = action.payload.user;
    }
  },
});

export const {userLogin,userLogout,editProfile} = userSlice.actions;
export default userSlice.reducer;