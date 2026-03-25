import { baseApi } from "../baseApi";

export interface Station {
    id: string;
    studioId: number;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "DEFECTIVE" | "MAINTENANCE";
    currentSubTeamId: string | null;
    createdAt: string;
    updatedAt: string;
    defectReason: string | null;
}

export interface UpdateStationStatusRequest {
    stationId: string;
    status: "ACTIVE" | "DEFECTIVE" | "MAINTENANCE";
    defectReason?: string;
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
        updateStationStatus: builder.mutation<any, UpdateStationStatusRequest>({
            query: (body) => ({
                url: "/admin/stations/status",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Studios"],
        }),
        uploadStudioImage: builder.mutation<any, { studioId: number | string; image: File }>({
            query: ({ studioId, image }) => {
                const formData = new FormData();
                formData.append("image", image);
                return {
                    url: `/admin/studios/${studioId}/upload-image`,
                    method: "PATCH",
                    body: formData,
                };
            },
            invalidatesTags: ["Studios"],
        }),
    }),
});

export const {
    useGetStudiosQuery,
    useLockStudioMutation,
    useUnlockStudioMutation,
    useToggleManualOverrideMutation,
    useUpdateStationStatusMutation,
    useUploadStudioImageMutation
} = studiosApi;
