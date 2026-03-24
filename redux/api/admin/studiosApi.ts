import { baseApi } from "../baseApi";

export interface Station {
    id: string;
    studioId: number;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "DEFECTIVE";
    currentSubTeamId: string | null;
    createdAt: string;
    updatedAt: string;
    defectReason: string | null;
}

export interface Studio {
    id: number;
    studioNumber: number;
    name: string;
    gameName: string;
    childCompatible: boolean;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "LOCKED";
    createdAt: string;
    sessionId: string | null;
    manualOverride: boolean;
    stations: Station[];
    assignments: any[]; // Adjust if you have a specific assignment type
}

export interface GetStudiosResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Studio[];
}

export const studiosApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStudios: builder.query<GetStudiosResponse, void>({
            query: () => ({
                url: "/admin/studios",
                method: "GET",
            }),
            providesTags: ["Studios"],
        }),
        lockStudio: builder.mutation<any, { studioNumber: number | string }>({
            query: (body) => ({
                url: "/admin/studios/lock",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios"],
        }),
        unlockStudio: builder.mutation<any, { studioNumber: number | string }>({
            query: (body) => ({
                url: "/admin/studios/unlock",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Studios"],
        }),
        toggleManualOverride: builder.mutation<any, { studioNumber: number | string; enabled: boolean }>({
            query: (body) => ({
                url: "/admin/studios/manual-override",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Studios"],
        }),
    }),
});

export const { useGetStudiosQuery, useLockStudioMutation, useUnlockStudioMutation, useToggleManualOverrideMutation } = studiosApi;
