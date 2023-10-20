// Redux Toolkit Query config.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Requests to Polls API.
export const pollApiSlice = createApi({
  reducerPath: "pollsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/polls/",
  }),
  tagTypes: ["Polls", "Categories", "Comments"],
  endpoints: (builder) => ({
    // CRUD Poll. //

    // Create Poll.
    createPoll: builder.mutation({
      query: (data) => ({
        url: "poll",
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Read Poll.
    readPoll: builder.query({
      query: (data) => ({
        url: `poll/${data.id}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Update Poll.
    updatePoll: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/update`,
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Delete Poll.
    deletePoll: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/delete`,
        method: "DELETE",
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Option manager //

    // Add option.
    addOption: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/option`,
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Vote manager //

    // Add user vote.
    addUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/vote`,
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Update user vote.
    updateUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/vote/update`,
        method: "PATCH",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Delete user vote.
    deleteUserVote: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/vote/delete`,
        method: "DELETE",
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),


    // CRUD Comment. //

    // Create comment.
    addComment: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/comment`,
        method: "POST",
        headers: data.headers,
        body: data.body,
      }),
      invalidatesTags: ["Comments"],
    }),

    //Read comments.
    readComments: builder.query({
      query: (data) => ({
        url: `poll/${data.id}/comments`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Comments"],
    }),



    // GET Polls. //

    // Get User Polls.
    getUserPolls: builder.query({
      query: (data) => ({
        url: data.page
          ? `user/${data.id}?page=${data.page}`
          : `user/${data.id}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Get User voted Polls.
    getUserVotedPolls: builder.query({
      query: (data) => ({
        url: data.page
          ? `user/${data.id}/voted_polls?page=${data.page}`
          : `user/${data.id}/voted_polls`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Get category polls.
    getPollsCategory: builder.query({
      query: (data) => ({
        url: data.page
          ? `category/${data.category}?page=${data.page}`
          : `category/${data.category}`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Others. //

    // Get categories.
    getCategories: builder.query({
      query: () => ({
        url: "categories",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),

    // Get categories data.
    getCategoriesData: builder.query({
      query: () => ({
        url: "categories/data",
        method: "GET",
      }),
      providesTags: ["Categories"],
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
  useGetCategoriesQuery,
  useGetPollsCategoryQuery,
  useAddOptionMutation,
  useGetCategoriesDataQuery,
  useAddCommentMutation,
  useReadCommentsQuery
} = pollApiSlice;
