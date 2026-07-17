import http from "@/utils/axios";
import Config from "@/utils/Config";
import { Account, ApiResponse } from "@/types/global";
import { AccountType } from "@/types/constants";

// Mock fallback until the API is live.
const MOCK_ACCOUNTS: Account[] = [
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
];

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const { data } = await http.get<ApiResponse<Account[]>>(
      Config.ENDPOINTS.ACCOUNTS.LIST
    );
    return data.data;
  } catch {
    return MOCK_ACCOUNTS;
  }
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  try {
    const { data } = await http.get<ApiResponse<Account>>(
      Config.ENDPOINTS.ACCOUNTS.DETAILS(id)
    );
    return data.data;
  } catch {
    return MOCK_ACCOUNTS.find((account) => account.id === id) ?? null;
  }
};
