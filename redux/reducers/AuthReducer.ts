import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/global";
import Config from "@/utils/Config";

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  rememberMe: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User; rememberMe?: boolean }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe ?? false;
      if (typeof window !== "undefined") {
        localStorage.setItem(Config.STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem(Config.STORAGE_KEYS.AUTH_TOKEN);
      }
    },
  },
});

export const { loginSuccess, setUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
