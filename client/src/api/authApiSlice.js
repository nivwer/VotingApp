// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/auth",
  }),
  endpoints: (builder) => ({
    // Create user.
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/singup",
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useCreateUserMutation } = authApiSlice;
