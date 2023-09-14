// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Auth API.
export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Register.
    signUp: builder.mutation({
      query: (data) => ({
        url: "signup/",
        method: "POST",
        body: data,
      }),
    }),

    // Login.
    signIn: builder.mutation({
      query: (data) => ({
        url: "signin/",
        method: "POST",
        body: data,
      }),
    }),

    // Logout.
    signOut: builder.mutation({
      query: (data) => ({
        url: "signout/",
        method: "POST",
        headers: data.headers,
      }),
    }),

    // Check the user session.
    checkSession: builder.query({
      query: () => ({
        url: "check-session/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useCheckSessionQuery,
} = authApiSlice;
