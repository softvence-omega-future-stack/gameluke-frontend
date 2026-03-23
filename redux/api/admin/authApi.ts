import { baseApi } from "../baseApi";
import { setCredentials, logout } from "../../features/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(
              setCredentials({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                user: data.data.user,
              }),
            );
          }
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/admin/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    refresh: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
    }),
    decodeToken: builder.query({
      query: () => ({
        url: "/auth/decode-token",
        method: "GET",
      }),
    }),
    verify: builder.query({
      query: () => ({
        url: "/auth/verify",
        method: "GET",
      }),
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwords,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useDecodeTokenQuery,
  useVerifyQuery,
  useChangePasswordMutation,
} = authApi;
