// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Profile API.
export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/profile/",
  }),
  endpoints: (builder) => ({
    // Get user profile.
    getProfile: builder.query({
      query: (data) => ({
        url: `get/${data.username}`,
        method: "GET",
      }),
    }),
  }),
});

export const {useGetProfileQuery} = profileApiSlice;
