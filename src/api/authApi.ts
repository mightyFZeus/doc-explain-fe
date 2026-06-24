import { AUTH_ENDPOINTS } from "@/constants/endpoints";
import type {
  ApiEnvelope,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterUserPayload,
  User,
  VerifyEmailPayload,
} from "@/types/apiTypes";
import { globalApi } from "./globalApi";

export const authApi = globalApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterUserPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.register,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<User>) => response.data,
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.login,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<LoginResponse> | LoginResponse) =>
        "data" in response ? response.data : response,
      invalidatesTags: ["Auth"],
    }),
    requestPasswordReset: builder.mutation<{ status?: string }, ForgotPasswordPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.forgotPassword,
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<User | { status?: string }, VerifyEmailPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.verifyEmail,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<User> | User) =>
        "data" in response ? response.data : response,
      invalidatesTags: ["Auth"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRequestPasswordResetMutation,
  useVerifyEmailMutation,
} = authApi;
