// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Polls API.
export const pollApiSlice = createApi({
  reducerPath: "pollsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/polls/",
  }),
  tagTypes: ["Polls", "Categories", "Category"],
  endpoints: (builder) => ({
    // CRUD Poll. //

    // Create Poll.
    createPoll: builder.mutation({
      query: (data) => ({
        url: "poll/create/",
        method: "POST",
        body: data.poll,
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Read Poll.
    readPoll: builder.query({
      query: (data) => ({
        url: `poll/read/${data.id}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Update Poll.
    updatePoll: builder.mutation({
      query: (data) => ({
        url: `poll/update/${data.poll_id}`,
        method: "PATCH",
        body: data.poll,
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Delete Poll.
    deletePoll: builder.mutation({
      query: (data) => ({
        url: `poll/delete/${data.id}`,
        method: "DELETE",
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Vote manager //

    // Add user vote.
    addUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/vote/add/${data.poll_id}`,
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Update user vote.
    updateUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/vote/update/${data.poll_id}`,
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Delete user vote.
    deleteUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/vote/delete/${data.poll_id}`,
        method: "DELETE",
        headers: data.headers,
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

    // Get User voted Polls.
    getUserVotedPolls: builder.query({
      query: (data) => ({
        url: `user/voted/${data.username}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Others.
    getPollCategories: builder.query({
      query: () => ({
        url: "categories/",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Others.
    getPollsCategory: builder.query({
      query: (data) => ({
        url: `category/${data.category}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),
  }),
});

export const {
  useGetUserPollsQuery,
  useGetUserVotedPollsQuery,
  useCreatePollMutation,
  useReadPollQuery,
  useUpdatePollMutation,
  useDeletePollMutation,
  useAddUserVoteMutation,
  useUpdateUserVoteMutation,
  useDeleteUserVoteMutation,
  useGetPollCategoriesQuery,
  useGetPollsCategoryQuery,
} = pollApiSlice;
