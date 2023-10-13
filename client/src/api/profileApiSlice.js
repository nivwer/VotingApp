// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Profile API.
export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/profiles/",
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Read user private profile.
    readProfile: builder.query({
      query: (data) => ({
        url: "profile/user/me",
        method: "GET",
        headers: data.headers
      }),
      providesTags: ["Profile"],
    }),

    // Update user profile.
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "profile/user/me/update",
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Get user public profile.
    getProfile: builder.query({
      query: (data) => ({
        url: `profile/user/${data.username}`,
        method: "GET",
        headers: data.headers
      }),
      providesTags: ["Profile"],
    }),
  }),
});

export const {
  useReadProfileQuery,
  useUpdateProfileMutation,
  useGetProfileQuery,
} = profileApiSlice;
