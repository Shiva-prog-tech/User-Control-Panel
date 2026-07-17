import http from "@/utils/axios";
import Config from "@/utils/Config";
import { AnalyticsSummary, ApiResponse } from "@/types/global";

// Mock fallback until the API is live.
const MOCK_SUMMARY: AnalyticsSummary = {
  totalSpentThisMonth: 0,
  totalIncomeThisMonth: 0.17,
  categories: [
    { category: "Software", amount: 540.0, percentage: 42 },
    { category: "Travel", amount: 531.62, percentage: 41 },
    { category: "Infrastructure", amount: 190.0, percentage: 15 },
    { category: "Food & Drink", amount: 18.0, percentage: 1.4 },
    { category: "Transport", amount: 6.3, percentage: 0.6 },
  ],
  monthlyComparison: [
    { month: "Jan", spending: 1071.62, income: 0 },
    { month: "Feb", spending: 150.0, income: 0 },
    { month: "Mar", spending: 40.0, income: 0 },
    { month: "Apr", spending: 18.0, income: 0 },
    { month: "May", spending: 6.3, income: 0 },
    { month: "Jun", spending: 0, income: 0.17 },
  ],
  trend: [
    { month: "Jan", amount: 1071.62 },
    { month: "Feb", amount: 150.0 },
    { month: "Mar", amount: 40.0 },
    { month: "Apr", amount: 18.0 },
    { month: "May", amount: 6.3 },
    { month: "Jun", amount: 0 },
  ],
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    const { data } = await http.get<ApiResponse<AnalyticsSummary>>(
      Config.ENDPOINTS.ANALYTICS.SUMMARY
    );
    return data.data;
  } catch {
    return MOCK_SUMMARY;
  }
};
