// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Auth API.
export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth/",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Register.
    signUp: builder.mutation({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
      }),
    }),

    // Login.
    signIn: builder.mutation({
      query: (data) => ({
        url: "signin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Logout.
    signOut: builder.mutation({
      query: (data) => ({
        url: "signout",
        method: "POST",
        headers: data.headers,
      }),
      invalidatesTags: ["User"],
    }),

    // Check the user session.
    checkSession: builder.query({
      query: () => ({
        url: "user/me/session/check",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update username.
    updateUsername: builder.mutation({
      query: (data) => ({
        url: "user/me/update/username",
        method: "PUT",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["User"],
    }),

    // Update password.
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "user/me/update/password",
        method: "PUT",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useCheckSessionQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
} = authApiSlice;
