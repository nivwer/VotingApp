// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Profile API.
export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/profile/",
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // Read user profile.
    readProfile: builder.query({
      query: (data) => ({
        url: "read/",
        method: "GET",
        headers: data.headers
      }),
      providesTags: ["Profile"],
    }),

    // Update user profile.
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "update/",
        method: "PATCH",
        body: data.profile,
        headers: data.headers
      }),
      invalidatesTags: ["Profile"],
    }),

    // Get user public profile.
    getProfile: builder.query({
      query: (data) => ({
        url: `get/${data.username}`,
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
