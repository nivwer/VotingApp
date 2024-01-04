import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pollsAPISlice = createApi({
  reducerPath: "pollsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/polls/",
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
} = pollsAPISlice;
