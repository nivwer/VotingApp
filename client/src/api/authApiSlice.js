// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth/",
  }),
  endpoints: (builder) => ({
    // Create user.
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "signup/",
        method: "POST",
        body: newUser,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "signin/",
        method: "POST",
        body: data,
      }),
    }),

    viewUser: builder.mutation({
      query: (data) => ({
        url: "user/",
        method: "GET",
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useViewUserMutation,
} = authApiSlice;
