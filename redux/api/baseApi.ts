import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  // baseUrl: "https://4lbnzk45-5000.asse.devtunnels.ms/api/v1",
  // baseUrl: "https://gameshow-development.vercel.app/api/v1",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken || Cookies.get("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["AdminAuth", "Studios", "Dashboard", "Groups", "Scores"],
  endpoints: () => ({}),
});
