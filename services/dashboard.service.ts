import { AccountType } from "@/modules/Accounts/types";
import { DashboardOverview } from "@/modules/Dashboard/types";
import { ApiResponse } from "@/types/global";
import http from "@/utils/axios";
import Config from "@/utils/Config";

// Mock fallback until the API is live — mirrors the dashboard designs.
const MOCK_OVERVIEW: DashboardOverview = {
  totalBalance: 1.5,
  accountBalance: 0.17,
  cardBalance: 1.33,
  monthlySpending: 0,
  activeCards: 2,
  totalCards: 2,
  pendingAmount: 0,
  sixMonthAverage: 214.32,
  peakMonth: { month: "Jan", amount: 1071.62 },
  spendingTrend: [
    { month: "Jan", amount: 1071.62 },
    { month: "Feb", amount: 150.0 },
    { month: "Mar", amount: 40.0 },
    { month: "Apr", amount: 18.0 },
    { month: "May", amount: 6.3 },
    { month: "Jun", amount: 0 },
  ],
  accounts: [
    {
      id: "acc_reward",
      name: "Reward Account",
      type: AccountType.REWARD,
      balance: 0,
      currency: "USD",
      accountNumber: "SW-88231-001",
    },
    {
      id: "acc_crypto",
      name: "Crypto Wallet",
      type: AccountType.PLATFORM,
      balance: 0.17,
      currency: "USD",
      accountNumber: "SW-88231-002",
    },
  ],
};

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const { data } = await http.get<ApiResponse<DashboardOverview>>(
      Config.ENDPOINTS.DASHBOARD.OVERVIEW
    );
    return data.data;
  } catch {
    return MOCK_OVERVIEW;
  }
};
