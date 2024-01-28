import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

export const accountsAPISlice = createApi({
  reducerPath: "accountsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backendUrl}/accounts/api/v1/`,
    credentials: "include",
  }),
  tagTypes: ["User", "UserProfile", "CSRFToken"],
  endpoints: (builder) => ({
    // Register.
    signUp: builder.mutation({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: { ...data, login_user: true, create_profile: true },
      }),
      invalidatesTags: ["User", "UserProfile", "CSRFToken"],
    }),

    // Login.
    signIn: builder.mutation({
      query: (data) => ({
        url: "login",
        method: "POST",
        body: { ...data },
      }),
      invalidatesTags: ["User", "UserProfile", "CSRFToken"],
    }),

    // Logout.
    signOut: builder.mutation({
      query: ({ headers }) => ({
        url: "logout",
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: ["User", "UserProfile", "CSRFToken"],
    }),

    // User session check.
    checkSession: builder.query({
      query: () => ({
        url: "user/session/check",
        method: "GET",
      }),
      providesTags: ["User", "UserProfile", "CSRFToken"],
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
        url: "user/update/username",
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["User", "UserProfile"],
    }),

    // Update password.
    updatePassword: builder.mutation({
      query: ({ headers, body }) => ({
        url: "user/update/password",
        method: "PATCH",
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

    // Update User Profile.
    userProfileUpdate: builder.mutation({
      query: ({ headers, body }) => ({
        url: "user/profile",
        method: "PUT",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    getCountries: builder.query({
      query: () => ({
        url: "countries",
        method: "GET",
      }),
      providesTags: ["Countries"],
    }),

    // GET User Profile By Username.
    userProfileByUsername: builder.query({
      query: ({ username }) => ({
        url: `user/${username}/profile`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    // Search users.
    searchUsers: builder.query({
      query: ({ headers, query, page = 1, page_size = 4 }) => ({
        url: `users/search?query=${query}&page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
    }),

    // Explore users.
    exploreUsers: builder.query({
      query: ({ headers, page = 1, page_size = 4 }) => ({
        url: `users/all?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
    }),


    // GET CSRF Token.
    CSRFToken: builder.query({
      query: () => ({
        url: "csrf-token",
        method: "GET",
      }),
      providesTags: ["CSRFToken"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useCheckSessionQuery,
  useUserQuery,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
  useUserProfileQuery,
  useUserProfileByUsernameQuery,
  useUserProfileUpdateMutation,
  useSearchUsersQuery,
  useExploreUsersQuery,
  useGetCountriesQuery,
  useCSRFTokenQuery,
} = accountsAPISlice;
