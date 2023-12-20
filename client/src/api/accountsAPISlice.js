import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountsAPISlice = createApi({
  reducerPath: "accountsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/accounts/",
    credentials: "include",
  }),
  tagTypes: ["User", "UserProfile"],
  endpoints: (builder) => ({
    // Register.
    signUp: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: { ...data, login_user: true, create_profile: true },
      }),
      invalidatesTags: ["User", "UserProfile"],
    }),

    // Login.
    signIn: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["User", "UserProfile"],
    }),

    // Logout.
    signOut: builder.mutation({
      query: ({ headers }) => ({
        url: "logout",
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: ["User", "UserProfile"],
    }),

    // User session check.
    checkSession: builder.query({
      query: () => ({
        url: "user/session/check",
        method: "GET",
      }),
      providesTags: ["User", "UserProfile"],
    }),

    // GET User.
    user: builder.query({
      query: () => ({
        url: "user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update username.
    updateUsername: builder.mutation({
      query: ({ headers, body }) => ({
        url: "user/me/update/username",
        method: "PUT",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["User", "UserProfile"],
    }),

    // Update password.
    updatePassword: builder.mutation({
      query: ({ headers, body }) => ({
        url: "user/me/update/password",
        method: "PUT",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["User"],
    }),

    // GET User Profile.
    userProfile: builder.query({
      query: () => ({
        url: "user/profile",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    // GET User Profile By Username.
    userProfileByUsername: builder.query({
      query: ({ username }) => ({
        url: `user/${username}/profile`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useCheckSessionQuery,
  useUserQuery,
  useUserProfileQuery,
  useUserProfileByUsernameQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
} = accountsAPISlice;
