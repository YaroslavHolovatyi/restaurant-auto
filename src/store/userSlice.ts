import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  username: string;
  token: string | null;
  profile: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: "",
  token: null,
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        username: string;
        name: string;
        role: string;
        email?: string;
        token?: string;
      }>
    ) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.token = action.payload.token || null;
      state.profile = {
        name: action.payload.name,
        email: action.payload.email || "",
        role: action.payload.role,
      };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = "";
      state.token = null;
      state.profile = null;
      // Also clear from localStorage
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
