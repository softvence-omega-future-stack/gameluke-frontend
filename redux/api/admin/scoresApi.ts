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

export const scoresApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    enterScores: builder.mutation<EnterScoresResponse, EnterScoresRequest>({
      query: (body) => ({
        url: "/admin/scores",
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
  }),
});

export const { useEnterScoresMutation, useGetScoresQuery } = scoresApi;
