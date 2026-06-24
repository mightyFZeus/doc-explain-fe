import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/apiTypes";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setSession: (
      state,
      action: PayloadAction<{ user?: User | null; token?: string | null }>,
    ) => {
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload.token !== undefined) {
        state.token = action.payload.token;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { clearAuth, setSession, setUser } = authSlice.actions;
export default authSlice.reducer;
