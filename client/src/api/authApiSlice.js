// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth/",
  }),
  endpoints: (builder) => ({
    // // GetCSRFToken.
    // getCSRFToken: builder.query({
    //   query: () => ({
    //     url: "/token/csrf",
    //     method: "GET",
    //   }),
    // }),

    // Create user.
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/singup",
        method: "POST",
        body: newUser,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: "token/",
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
  useGetCSRFTokenQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useViewUserMutation,
} = authApiSlice;
