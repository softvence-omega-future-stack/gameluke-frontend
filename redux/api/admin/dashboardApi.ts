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

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => "/admin/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
