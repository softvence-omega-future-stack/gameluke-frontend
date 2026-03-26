import { baseApi } from "../baseApi";

export interface CreateGroupRequest {
    name?: string;
    maxPlayers: number;
    pin: string;
    childFriendly: boolean;
}

export interface CreateGroupResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface WaitlistGroup {
    id: string;
    name: string;
    pin: string;
    totalPlayers: number;
    maxPlayers: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    childFriendly: boolean;
    waitlistPosition: number | null;
}

interface GetWaitlistResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: WaitlistGroup[];
}

export const groupsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createGroup: builder.mutation<CreateGroupResponse, CreateGroupRequest>({
            query: (body) => ({
                url: "/admin/groups",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Groups"],
        }),
        getWaitlist: builder.query<GetWaitlistResponse, void>({
            query: () => ({
                url: "/admin/waitlist",
                method: "GET",
            }),
            providesTags: ["Groups"],
        }),
        getGroups: builder.query<any, void>({
            query: () => ({
                url: "/admin/groups",
                method: "GET",
            }),
            providesTags: ["Groups"],
        }),
        startAllWaitlist: builder.mutation<any, void>({
            query: () => ({
                url: "/admin/waitlist/start-all",
                method: "POST",
            }),
            invalidatesTags: ["Groups"],
        }),
    }),
});

export const { useCreateGroupMutation, useGetWaitlistQuery, useGetGroupsQuery, useStartAllWaitlistMutation } = groupsApi;
