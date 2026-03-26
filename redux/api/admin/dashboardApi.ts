import { baseApi } from "../baseApi";

export interface DashboardStats {
  activeGroups: number;
  waitingGroups: number;
  defectiveStations: number;
}

export interface DashboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

export interface AnalyticsOverview {
  totalSessions: number;
  sessionGrowth: number;
  totalPlayers: number;
  playerGrowth: number;
  avgSessionTime: number;
}

export interface TrafficData {
  hour: number;
  players: number;
}

export interface GroupSizeData {
  size: number;
  count: number;
}

export interface TopGroupData {
  id: string | number;
  name: string;
  games: number;
  totalScore: string | number;
  avgScore: number;
}

export interface AnalyticsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    overview: AnalyticsOverview;
    traffic: TrafficData[];
    groupSizes: GroupSizeData[];
    topGroups: TopGroupData[];
  };
}

export interface AnalyticsParams {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),
    getAnalytics: builder.query<AnalyticsResponse, AnalyticsParams>({
      query: (params) => ({
        url: "/admin/analytics",
        method: "GET",
        params,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useGetAnalyticsQuery } = dashboardApi;
