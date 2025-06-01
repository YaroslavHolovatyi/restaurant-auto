import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  username: string;
  profile: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  username: '',
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ username: string; name: string; role: string; email?: string }>) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
      state.profile = {
        name: action.payload.name,
        email: action.payload.email || '',
        role: action.payload.role,
      };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = '';
      state.profile = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer; 