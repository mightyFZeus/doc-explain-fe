import { combineReducers } from "@reduxjs/toolkit";
import { globalApi } from "@/api/globalApi";
import authReducer from "./slices/authSlice";
import documentChatReducer from "./slices/documentChatSlice";

export const rootReducer = combineReducers({
  [globalApi.reducerPath]: globalApi.reducer,
  auth: authReducer,
  documentChat: documentChatReducer,
});
