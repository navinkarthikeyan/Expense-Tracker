import { createSlice } from "@reduxjs/toolkit";
// import { setUserData } from "./reducers";

const initialState = {
  value: 0,
};

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
