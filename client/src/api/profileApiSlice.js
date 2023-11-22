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
      query: ({ headers }) => ({
        url: "profile/user/me",
        method: "GET",
        headers: headers,
      }),
      providesTags: ["Profile"],
    }),

    // Update user profile.
    profileMeUpdate: builder.mutation({
      query: ({ headers, body }) => ({
        url: "profile/user/me/update",
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // GET user public profile.
    profileByUsername: builder.query({
      query: ({headers, username}) => ({
        url: `profile/user/${username}`,
        method: "GET",
        headers: headers,
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
      query: ({ headers, query, page = 1, page_size = 4}) => ({
        url: `search?query=${query}&page=${page}&page_size=${page_size}`,
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
} = profileApiSlice;
