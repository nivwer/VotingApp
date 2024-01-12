import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pollsAPISlice = createApi({
  reducerPath: "pollsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/polls/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Polls"],

  endpoints: (builder) => ({
    // CRUD Poll. //

    // Create Poll.
    createPoll: builder.mutation({
      query: ({ headers, body }) => ({
        url: "poll",
        method: "POST",
        headers: headers,
        body: body,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Read Poll.
    readPoll: builder.query({
      query: ({ headers, id }) => ({
        url: `poll/${id}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: ["Polls"],
      providesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.poll.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Update Poll.
    updatePoll: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `poll/${id}`,
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Delete Poll.
    deletePoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Option manager //

    // Add option.
    addOption: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `poll/${id}/option`,
        method: "POST",
        headers: headers,
        body: body,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
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
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Update user vote.
    updateUserVote: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `poll/${id}/vote`,
        method: "PATCH",
        headers: headers,
        body: body,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Delete user vote.
    deleteUserVote: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/vote`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // CRUD Comment. //

    // Create comment.
    addComment: builder.mutation({
      query: ({ headers, body, id }) => ({
        url: `poll/${id}/comment`,
        method: "POST",
        headers: headers,
        body: body,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
              { type: "Comments", id: res.comment_id },
              { type: "Comments", id: "PARTIAL-LIST" },
            ]
          : [
              { type: "Polls", id: "PARTIAL-LIST" },
              { type: "Comments", id: "PARTIAL-LIST" },
            ],
    }),

    // Remove comment.
    deleteComment: builder.mutation({
      query: ({ headers, id, comment_id }) => ({
        url: `poll/${id}/comment/${comment_id}`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
              { type: "Comments", id: res.comment_id },
              { type: "Comments", id: "PARTIAL-LIST" },
            ]
          : [
              { type: "Polls", id: "PARTIAL-LIST" },
              { type: "Comments", id: "PARTIAL-LIST" },
            ],
    }),

    // Read comments.
    readComments: builder.query({
      query: ({ headers, id, page = 1, page_size = 4 }) => ({
        url: `poll/${id}/comments?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ comment: { id } }) => ({
                type: "Comments",
                id: id,
              })),
              { type: "Comments", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Comments", id: "PARTIAL-LIST" }],
    }),

    // Share manager. //

    // Share action.
    sharePoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/share`,
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // UnShare action.
    unSharePoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/share`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Bookmark manager. //

    // Bookmark action.
    bookmarkPoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/bookmark`,
        method: "POST",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // UnBookmark action.
    unBookmarkPoll: builder.mutation({
      query: ({ headers, id }) => ({
        url: `poll/${id}/bookmark`,
        method: "DELETE",
        headers: headers,
      }),
      invalidatesTags: (res, error) =>
        res
          ? [
              { type: "Polls", id: res.id },
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // GET Polls. //

    // Get User Polls.
    getUserPolls: builder.query({
      query: ({ headers, id, page = 1, page_size = 4 }) => ({
        url: `polls/user/${id}?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Get User voted Polls.
    getUserVotedPolls: builder.query({
      query: ({ headers, id, page = 1, page_size = 4 }) => ({
        url: `polls/user/${id}/votes?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Get User shared Polls.
    getUserSharedPolls: builder.query({
      query: ({ headers, id, page = 1, page_size = 4 }) => ({
        url: `polls/user/${id}/shares?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Get User bookmarked Polls.
    getUserBookmarkedPolls: builder.query({
      query: ({ headers, id, page = 1, page_size = 4 }) => ({
        url: `polls/user/${id}/bookmarks?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),

    // Get category polls.
    getPollsCategory: builder.query({
      query: ({ headers, category, page = 1, page_size = 4 }) => ({
        url: `polls/category/${category}?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
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

    // Search Polls.
    searchPolls: builder.query({
      query: ({ headers, query, page = 1, page_size = 4 }) => ({
        url: `polls/search?query=${query}&page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),


    // All Polls.
    allPolls: builder.query({
      query: ({ headers, page = 1, page_size = 4 }) => ({
        url: `polls/all?page=${page}&page_size=${page_size}`,
        method: "GET",
        headers: headers,
      }),
      providesTags: (res, error) =>
        res
          ? [
              ...res.items.map(({ poll: { id } }) => ({ type: "Polls", id: id })),
              { type: "Polls", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Polls", id: "PARTIAL-LIST" }],
    }),
  }),
});

export const {
  useCreatePollMutation,
  useReadPollQuery,
  useUpdatePollMutation,
  useDeletePollMutation,
  useAddOptionMutation,
  useAddUserVoteMutation,
  useUpdateUserVoteMutation,
  useDeleteUserVoteMutation,
  useSharePollMutation,
  useUnSharePollMutation,
  useBookmarkPollMutation,
  useUnBookmarkPollMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
  useReadCommentsQuery,
  useGetUserPollsQuery,
  useGetUserVotedPollsQuery,
  useGetUserSharedPollsQuery,
  useGetUserBookmarkedPollsQuery,
  useGetPollsCategoryQuery,
  useGetCategoriesQuery,
  useSearchPollsQuery,
  useAllPollsQuery,
} = pollsAPISlice;
