import { baseApi } from "../baseApi";

interface PlayerLoginResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        group: any;
    };
}

export interface Group {
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
    players: {
        id: string;
        name: string;
        email: string;
    }[];
    studioAssignments: any[];
}

interface GetAvailableGroupsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: Group[];
}

export const playerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        playerLogin: builder.mutation<PlayerLoginResponse, { name: string; email: string }>({
            query: (body) => ({
                url: "/players/login",
                method: "POST",
                body,
            }),
        }),
        getAvailableGroups: builder.query<GetAvailableGroupsResponse, void>({
            query: () => ({
                url: "/players/groups",
                method: "GET",
            }),
            providesTags: ["Groups"],
        }),
        getGroupDetails: builder.query<any, string>({
            query: (id) => ({
                url: `/players/groups/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Groups", id }],
        }),
        joinGroup: builder.mutation<any, { pin: string; email: string }>({
            query: (body) => ({
                url: "/players/join",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Groups"],
        }),
    }),
});

export const { 
    usePlayerLoginMutation, 
    useGetAvailableGroupsQuery, 
    useGetGroupDetailsQuery,
    useJoinGroupMutation
} = playerApi;
