import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, Transaction } from "@/types/global";
import { TransactionStatus, TransactionType } from "@/types/constants";

export interface TransactionFilters {
  search?: string;
  status?: TransactionStatus | "";
  type?: TransactionType | "";
  from?: string;
  to?: string;
  cardId?: string;
}

// Mock fallback until the API is live.
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    date: "2026-01-08T11:24:00.000Z",
    description: "Annual SaaS subscription",
    merchant: "Figma",
    category: "Software",
    amount: 540.0,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_001",
  },
  {
    id: "txn_002",
    date: "2026-01-15T09:10:00.000Z",
    description: "Team offsite bookings",
    merchant: "Airbnb",
    category: "Travel",
    amount: 531.62,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_002",
  },
  {
    id: "txn_003",
    date: "2026-02-03T16:45:00.000Z",
    description: "Cloud hosting",
    merchant: "Vercel",
    category: "Infrastructure",
    amount: 150.0,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_001",
  },
  {
    id: "txn_004",
    date: "2026-03-12T13:30:00.000Z",
    description: "Domain renewal",
    merchant: "Namecheap",
    category: "Infrastructure",
    amount: 40.0,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_001",
  },
  {
    id: "txn_005",
    date: "2026-04-22T10:00:00.000Z",
    description: "Coffee with client",
    merchant: "Starbucks",
    category: "Food & Drink",
    amount: 18.0,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_002",
  },
  {
    id: "txn_006",
    date: "2026-05-30T19:15:00.000Z",
    description: "Ride to airport",
    merchant: "Uber",
    category: "Transport",
    amount: 6.3,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_002",
  },
  {
    id: "txn_007",
    date: "2026-06-18T08:00:00.000Z",
    description: "Cashback reward",
    merchant: "Swipeo Rewards",
    category: "Rewards",
    amount: 0.17,
    currency: "USD",
    status: TransactionStatus.COMPLETED,
    type: TransactionType.CREDIT,
    accountId: "acc_reward",
  },
  {
    id: "txn_008",
    date: "2026-07-11T12:05:00.000Z",
    description: "Pending merchant hold",
    merchant: "Amazon",
    category: "Shopping",
    amount: 24.99,
    currency: "USD",
    status: TransactionStatus.PENDING,
    type: TransactionType.DEBIT,
    accountId: "acc_crypto",
    cardId: "card_001",
  },
];

const applyFilters = (
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] => {
  return transactions.filter((txn) => {
    if (filters.cardId && txn.cardId !== filters.cardId) return false;
    if (filters.status && txn.status !== filters.status) return false;
    if (filters.type && txn.type !== filters.type) return false;
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const haystack =
        `${txn.description} ${txn.merchant} ${txn.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.from && new Date(txn.date) < new Date(filters.from)) return false;
    if (filters.to && new Date(txn.date) > new Date(filters.to)) return false;
    return true;
  });
};

export const getTransactions = async (
  filters: TransactionFilters = {}
): Promise<Transaction[]> => {
  try {
    const { data } = await http.get<ApiResponse<Transaction[]>>(
      Config.ENDPOINTS.TRANSACTIONS.LIST,
      { params: filters }
    );
    return data.data;
  } catch {
    return applyFilters(MOCK_TRANSACTIONS, filters);
  }
};

export const getTransactionById = async (
  id: string
): Promise<Transaction | null> => {
  try {
    const { data } = await http.get<ApiResponse<Transaction>>(
      Config.ENDPOINTS.TRANSACTIONS.DETAILS(id)
    );
    return data.data;
  } catch {
    return MOCK_TRANSACTIONS.find((txn) => txn.id === id) ?? null;
  }
};
