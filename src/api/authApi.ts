import { AUTH_ENDPOINTS } from "@/constants/endpoints";
import type {
  ApiEnvelope,
  ForgotPasswordPayload,
  GuestTrialResponse,
  LoginPayload,
  LoginResponse,
  RegisterUserPayload,
  User,
  VerifyEmailPayload,
} from "@/types/apiTypes";
import { globalApi } from "./globalApi";

type RegisterUserResponse = ApiEnvelope<User> | User;
type LoginUserResponse = ApiEnvelope<LoginResponse> | LoginResponse;
type GuestTrialApiResponse =
  | ApiEnvelope<GuestTrialResponse>
  | GuestTrialResponse;

const hasData = <T>(response: T | ApiEnvelope<T>): response is ApiEnvelope<T> =>
  Boolean(
    response &&
      typeof response === "object" &&
      "data" in response &&
      (response as ApiEnvelope<T>).data !== undefined,
  );

const normalizeRegisterResponse = (response: RegisterUserResponse) =>
  hasData(response) ? response.data : response;

const normalizeLoginResponse = (response: LoginUserResponse) => {
  const session = hasData(response) ? response.data : response;

  return {
    ...session,
    accessToken: session.accessToken ?? session.token,
  };
};

const normalizeGuestTrialResponse = (response: GuestTrialApiResponse) =>
  hasData(response) ? response.data : response;

export const authApi = globalApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<User, RegisterUserPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.register,
        method: "POST",
        body,
      }),
      transformResponse: normalizeRegisterResponse,
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: AUTH_ENDPOINTS.login,
        method: "POST",
        body,
      }),
      transformResponse: normalizeLoginResponse,
      invalidatesTags: ["Auth"],
    }),
    startGuestTrial: builder.mutation<GuestTrialResponse, void>({
      query: () => ({
        url: AUTH_ENDPOINTS.guest,
        method: "POST",
      }),
      transformResponse: normalizeGuestTrialResponse,
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
  useStartGuestTrialMutation,
  useVerifyEmailMutation,
} = authApi;
