import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApiSlice = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/profiles/" }),
  tagTypes: ["Profile", "Countries"],
  endpoints: (builder) => ({
    profileMe: builder.query({
      query: ({ headers }) => ({
        url: "profile/user/me",
        method: "GET",
        headers: headers,
      }),
      providesTags: ["Profile"],
    }),

    profileMeUpdate: builder.mutation({
      query: ({ headers, body }) => ({
        url: "profile/user/me/update",
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["Profile"],
    }),

    profileByUsername: builder.query({
      query: ({ headers, username }) => ({
        url: `profile/user/${username}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: ["Profile"],
    }),

    getCountries: builder.query({
      query: () => ({
        url: "countries",
        method: "GET",
      }),
      providesTags: ["Countries"],
    }),

    searchUsers: builder.query({
      query: ({ headers, query, page = 1, page_size = 4 }) => ({
        url: `search?query=${query}&page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
    }),

    exploreUsers: builder.query({
      query: ({ headers, page = 1, page_size = 4 }) => ({
        url: `explore?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
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
  useExploreUsersQuery,
} = profileApiSlice;
