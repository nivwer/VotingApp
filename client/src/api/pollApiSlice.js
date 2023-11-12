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
      invalidatesTags: ["Comments", "Polls"],
    }),

    // Remove comment.
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/comment/${data.comment_id}/delete`,
        method: "DELETE",
        headers: data.headers,
      }),
      invalidatesTags: ["Comments", "Polls"],
    }),

    // Read comments.
    readComments: builder.query({
      query: (data) => ({
        url: `poll/${data.id}/comments`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Comments"],
    }),

    // Share manager. //

    // Share action.
    sharePoll: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/share`,
        method: "POST",
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // UnShare action.
    unSharePoll: builder.mutation({
      query: (data) => ({
        url: `poll/${data.id}/unshare`,
        method: "DELETE",
        headers: data.headers,
      }),
      invalidatesTags: ["Polls"],
    }),

    // Bookmark manager. //

    // Bookmark action.
    bookmarkPoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/bookmark`,
        method: "POST",
        headers: headers,
      }),
      // invalidatesTags: ["Polls"],
      invalidatesTags: (result, error, id) => [
        { type: "Polls", id: result.id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
    }),

    // UnBookmark action.
    unBookmarkPoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/unbookmark`,
        method: "DELETE",
        headers: headers,
      }),
      // invalidatesTags: ["Polls"],
      invalidatesTags: (result, error, id) => [
        { type: "Polls", id: result.id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
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
      // providesTags: ["Polls"],
      providesTags: (result, error, page) =>
        result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.polls.map(({ _id }) => ({
                type: "Polls",
                id: _id,
              })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Get User voted Polls.
    getUserVotedPolls: builder.query({
      query: (data) => ({
        url: data.page
          ? `user/${data.id}/votes?page=${data.page}`
          : `user/${data.id}/votes`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Get User shared Polls.
    getUserSharedPolls: builder.query({
      query: (data) => ({
        url: data.page
          ? `user/${data.id}/shares?page=${data.page}`
          : `user/${data.id}/shares`,
        method: "GET",
        headers: data.headers,
      }),
      providesTags: ["Polls"],
    }),

    // Get User bookmarked Polls.
    getUserBookmarkedPolls: builder.query({
      query: (data) => ({
        url: data.page
          ? `user/${data.id}/bookmarks?page=${data.page}`
          : `user/${data.id}/bookmarks`,
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

    // Search Users.
    searchPolls: builder.query({
      query: ({ headers, query, page = 1 }) => ({
        url: `search?query=${query}&page=${page}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (result, error, page) =>
        result && result.polls
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.polls.map(({ _id }) => ({
                type: "Polls",
                id: _id,
              })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useGetUserPollsQuery,
  useGetUserVotedPollsQuery,
  useGetUserSharedPollsQuery,
  useGetUserBookmarkedPollsQuery,
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
  useReadCommentsQuery,
  useDeleteCommentMutation,
  useSharePollMutation,
  useUnSharePollMutation,
  useBookmarkPollMutation,
  useUnBookmarkPollMutation,
  useSearchPollsQuery,
} = pollApiSlice;
