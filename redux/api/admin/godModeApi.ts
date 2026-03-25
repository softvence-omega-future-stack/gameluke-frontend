import { baseApi } from "../baseApi";

export interface SubTeam {
    id: string;
    name: string;
    score: number;
}

export interface Assignment {
    assignmentId: string;
    studioId: number;
    studioNumber: number;
    studioName: string;
    subTeams: SubTeam[];
}

export interface ActiveGroup {
    groupId: string;
    groupName: string;
    status: "WAITING" | "PLAYING" | "FINISHED";
    playerCount: number;
    isPaused: boolean;
    assignments: Assignment[];
}

export interface ActiveSession {
    sessionId: string;
    isActive: boolean;
    isPaused: boolean;
    startTime: string;
    durationMin: number;
    pausedAt: string | null;
    studios: any[];
}

export interface GodModeSessionsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        activeGroups: ActiveGroup[];
        activeSessions: ActiveSession[];
    };
}

export const godModeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getGodModeSessions: builder.query<GodModeSessionsResponse, void>({
            query: () => ({
                url: "/admin/god-mode/sessions",
                method: "GET",
            }),
            providesTags: ["Studios", "Groups"],
        }),
        assignGroup: builder.mutation<any, { groupId: string; studioNumber: number }>({
            query: (body) => ({
                url: "/admin/god-mode/assign",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios", "Groups"],
        }),
        pauseSession: builder.mutation<any, { groupId: string }>({
            query: (body) => ({
                url: "/admin/god-mode/pause",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios", "Groups"],
        }),
        resumeSession: builder.mutation<any, { groupId: string }>({
            query: (body) => ({
                url: "/admin/god-mode/resume",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios", "Groups"],
        }),
        forceEndSession: builder.mutation<any, { groupId: string }>({
            query: (body) => ({
                url: "/admin/god-mode/force-end",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios", "Groups"],
        }),
    }),
});

export const {
    useGetGodModeSessionsQuery,
    useAssignGroupMutation,
    usePauseSessionMutation,
    useResumeSessionMutation,
    useForceEndSessionMutation
} = godModeApi;
