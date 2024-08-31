import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./user/slice";

export const store = configureStore({
  reducer: {
    user: userDataSlice,
  },
});
