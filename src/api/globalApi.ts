import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, HEALTH_ENDPOINT } from "@/constants/endpoints";
import type { HealthResponse } from "@/types/apiTypes";
import type { RootState } from "@/store/store";

export const globalApi = createApi({
  reducerPath: "globalQuery",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Conversation", "Document", "Health"],
  endpoints: (builder) => ({
    health: builder.query<HealthResponse, void>({
      query: () => HEALTH_ENDPOINT,
      providesTags: ["Health"],
    }),
  }),
});

export const { useHealthQuery } = globalApi;
