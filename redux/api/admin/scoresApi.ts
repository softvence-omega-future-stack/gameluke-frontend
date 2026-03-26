import { baseApi } from "../baseApi";

interface EnterScoresRequest {
  assignmentId: string;
  scores: Record<string, number>;
  playerId: string;
}

interface EnterScoresResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
}

interface EditScoreRequest {
  gameResultId: string;
  subTeamName: string;
  newScore: number;
  reason: string;
}

export const scoresApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enterScores: builder.mutation<EnterScoresResponse, EnterScoresRequest>({
      query: (body) => ({
        url: "/players/scores",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Scores"],
    }),
    getScores: builder.query<any, void>({
      query: () => ({
        url: "/admin/scores",
        method: "GET",
      }),
      providesTags: ["Scores"],
    }),
    editScore: builder.mutation<any, EditScoreRequest>({
      query: (body) => ({
        url: "/admin/scores/edit",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Scores"],
    }),
  }),
});

export const { useEnterScoresMutation, useGetScoresQuery, useEditScoreMutation } = scoresApi;
