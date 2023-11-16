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
      query: ({ headers, body, id }) => ({
        url: `poll/${id}/vote`,
        method: "POST",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
    }),

    // Update user vote.
    updateUserVote: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `poll/${id}/vote/update`,
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
    }),

    // Delete user vote.
    deleteUserVote: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/vote/delete`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
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
      query: ({ headers, id }) => ({
        url: `poll/${id}/share`,
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
    }),

    // UnShare action.
    unSharePoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/unshare`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
        { type: "Polls", id: "PARTIAL-LIST" },
      ],
    }),

    // Bookmark manager. //

    // Bookmark action.
    bookmarkPoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/bookmark`,
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
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
      invalidatesTags: ({ id }) => [
        { type: "Polls", id: id },
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
      providesTags: (result) =>
        result
          ? [
              ...result.polls.map(({ id }) => ({ type: "Polls", id: id })),
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

    // Search Polls.
    searchPolls: builder.query({
      query: ({ headers, query, page = 1, page_size = 4 }) => ({
        url: `search?query=${query}&page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: ({ items }) =>
        items
          ? [
              ...items.map(({ id }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  // CRUD Poll.
  useCreatePollMutation,
  useReadPollQuery,
  useUpdatePollMutation,
  useDeletePollMutation,
  // CRUD Vote.
  useAddUserVoteMutation,
  useUpdateUserVoteMutation,
  useDeleteUserVoteMutation,
  // Option Mutation.
  useAddOptionMutation,
  // Comment CRUD.
  useReadCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  // Share Mutations.
  useSharePollMutation,
  useUnSharePollMutation,
  // Bookmark Mutations.
  useBookmarkPollMutation,
  useUnBookmarkPollMutation,
  // User polls Querys.
  useGetUserPollsQuery,
  useGetUserVotedPollsQuery,
  useGetUserSharedPollsQuery,
  useGetUserBookmarkedPollsQuery,
  // Search Polls Query.
  useSearchPollsQuery,
  // Categories Querys.
  useGetCategoriesQuery,
  useGetCategoriesDataQuery,
  useGetPollsCategoryQuery,
} = pollApiSlice;
