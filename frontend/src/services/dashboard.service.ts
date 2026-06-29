import { apiRequest } from "./api";
import type { DashboardMetrics } from "@/types/admin";

export const dashboardService = {
  getMetrics(): Promise<DashboardMetrics> {
    return apiRequest<DashboardMetrics>("/dashboard", { auth: true });
  },
};