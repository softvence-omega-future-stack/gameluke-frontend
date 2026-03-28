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

export interface TeamAssignment {
    id: string;
    groupId: string;
    studioId: number;
    config: {
        teamSetup: string;
        studioSize: number;
    };
    createdAt: string;
    studio: {
        id: number;
        studioNumber: number;
        name: string;
        gameName: string;
        childCompatible: boolean;
        status: string;
        createdAt: string;
        sessionId: string | null;
        manualOverride: boolean;
        imageUrl: string;
    };
    subTeams: {
        id: string;
        name: string;
        color: string | null;
        score: number;
        assignmentId: string;
        createdAt: string;
        updatedAt: string;
        players: {
            id: string;
            subTeamId: string;
            playerId: string;
            player: {
                id: string;
                name: string;
                email: string;
                groupId: string;
                pairUnitId: string | null;
                gamesPlayed: number;
                createdAt: string;
                updatedAt: string;
                registeredByAdmin: boolean;
                ticketValidUntil: string | null;
            };
        }[];
    }[];
    group?: {
        id: string;
        name: string;
        pin: string;
        totalPlayers: number;
        maxPlayers: number;
        status: string;
        childFriendly: boolean;
    };
}

interface GetTeamsResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: TeamAssignment[];
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
                url: "/players/groups/join",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Groups"],
        }),
        getStudioDetails: builder.query<any, string | number>({
            query: (id) => ({
                url: `/players/studios/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Studios", id }],
        }),
        getTeams: builder.query<GetTeamsResponse, string>({
            query: (groupId) => ({
                url: `/players/teams/${groupId}`,
                method: "GET",
            }),
            providesTags: (result, error, groupId) => [{ type: "Groups", id: groupId }],
        }),
        confirmTeams: builder.mutation<any, { groupId: string; teams: { teamId: string; playerIds: string[] }[] }>({
            query: (body) => ({
                url: "/players/confirm-teams",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { groupId }) => [{ type: "Groups", id: groupId }],
        }),
    }),
});

export const {
    usePlayerLoginMutation,
    useGetAvailableGroupsQuery,
    useGetGroupDetailsQuery,
    useJoinGroupMutation,
    useGetStudioDetailsQuery,
    useGetTeamsQuery,
    useConfirmTeamsMutation,
} = playerApi;
