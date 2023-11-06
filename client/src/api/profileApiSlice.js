// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Profile API.
export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/profiles/",
  }),
  tagTypes: ["Profile", "Countries"],
  endpoints: (builder) => ({
    // GET user private profile.
    profileMe: builder.query({
      query: (data) => ({
        url: "profile/user/me",
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Profile"],
    }),

    // Update user profile.
    profileMeUpdate: builder.mutation({
      query: (data) => ({
        url: "profile/user/me/update",
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // GET user public profile.
    profileByUsername: builder.query({
      query: (data) => ({
        url: `profile/user/${data.username}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Profile"],
    }),

    // GET countries.
    getCountries: builder.query({
      query: () => ({
        url: "countries",
        method: "GET",
      }),
      providesTags: ["Countries"],
    }),

    // Search Users.
    searchUsers: builder.query({
      query: (data) => ({
        url: `profile/search`,
        method: "GET",
        headers: data.headers,
      }),
    }),
  }),
});

export const {
  useProfileMeQuery,
  useProfileMeUpdateMutation,
  useProfileByUsernameQuery,
  useGetCountriesQuery,
  useSearchUsersQuery,
} = profileApiSlice;
