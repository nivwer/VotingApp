// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Polls API.
export const pollApiSlice = createApi({
  reducerPath: "pollsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/poll/",
  }),
  tagTypes: ["Polls"],
  endpoints: (builder) => ({
    // CRUD Poll. //

    // Create Poll.
    createPoll: builder.mutation({
      query: (data) => ({
        url: "create/",
        method: "POST",
        body: data.poll,
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }),
      invalidatesTags: ["Polls"],
    }),

    // Read Poll.
    readPoll: builder.query({
      query: (data) => ({
        url: `read/${data.id}`,
        method: "GET",
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }),
    }),

    // Update Poll.
    updatePoll: builder.mutation({
      query: (data) => ({
        url: `update/${data.poll_id}`,
        method: "PATCH",
        body: data.poll,
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }),
      invalidatesTags: ["Polls"],
    }),

    // Delete Poll.
    deletePoll: builder.mutation({
      query: (data) => ({
        url: `delete/${data.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }),
      invalidatesTags: ["Polls"],
    }),

    // GET Polls. //

    // Get User Polls.
    getUserPolls: builder.query({
      query: (data) => ({
        url: `user/${data.username}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Vote manager //

    // Add user vote.
    addUserVote: builder.mutation({
      query: (data) => ({
        url: `vote/${data.poll_id}`,
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Update user vote.
    updateUserVote: builder.mutation({
      query: (data) => ({
        url: `vote/${data.poll_id}`,
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),
  }),
});

export const {
  useGetUserPollsQuery,
  useCreatePollMutation,
  useReadPollMutation,
  useUpdatePollMutation,
  useDeletePollMutation,
  useAddUserVoteMutation,
  useUpdateUserVoteMutation,
} = pollApiSlice;
