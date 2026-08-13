import {
  Beneficiary,
  Transfer,
  TransferStatus,
} from "@/modules/Transfers/types";
import { ApiResponse } from "@/types/global";
import http from "@/utils/axios";
import Config from "@/utils/Config";

export interface SendMoneyPayload {
  fromAccountId: string;
  beneficiaryId: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface AddFundsPayload {
  toAccountId: string;
  amount: number;
  currency: string;
  method: "BANK_TRANSFER" | "CARD" | "CRYPTO";
}

// Mock fallbacks until the API is live.
const MOCK_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben_001",
    name: "Rahul Sharma",
    accountNumber: "IN-4471-9902",
    bankName: "HDFC Bank",
  },
  {
    id: "ben_002",
    name: "Priya Verma",
    accountNumber: "IN-8823-1145",
    bankName: "ICICI Bank",
  },
  {
    id: "ben_003",
    name: "Acme Suppliers Ltd",
    accountNumber: "US-5510-7738",
    bankName: "Chase",
  },
];

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: "trf_001",
    recipientName: "Rahul Sharma",
    amount: 120,
    currency: "USD",
    status: TransferStatus.COMPLETED,
    date: "2026-06-28T14:20:00.000Z",
    note: "Dinner split",
  },
  {
    id: "trf_002",
    recipientName: "Acme Suppliers Ltd",
    amount: 640.5,
    currency: "USD",
    status: TransferStatus.COMPLETED,
    date: "2026-06-14T09:05:00.000Z",
  },
  {
    id: "trf_003",
    recipientName: "Priya Verma",
    amount: 45,
    currency: "USD",
    status: TransferStatus.PENDING,
    date: "2026-07-10T18:40:00.000Z",
  },
];

export const getBeneficiaries = async (): Promise<Beneficiary[]> => {
  try {
    const { data } = await http.get<ApiResponse<Beneficiary[]>>(
      Config.ENDPOINTS.TRANSFERS.BENEFICIARIES
    );
    return data.data;
  } catch {
    return MOCK_BENEFICIARIES;
  }
};

export const getRecentTransfers = async (): Promise<Transfer[]> => {
  try {
    const { data } = await http.get<ApiResponse<Transfer[]>>(
      Config.ENDPOINTS.TRANSFERS.LIST
    );
    return data.data;
  } catch {
    return MOCK_TRANSFERS;
  }
};

export const sendMoney = async (payload: SendMoneyPayload): Promise<Transfer> => {
  try {
    const { data } = await http.post<ApiResponse<Transfer>>(
      Config.ENDPOINTS.TRANSFERS.SEND,
      payload
    );
    return data.data;
  } catch {
    const beneficiary = MOCK_BENEFICIARIES.find(
      (item) => item.id === payload.beneficiaryId
    );
    return {
      id: `trf_${payload.beneficiaryId}`,
      recipientName: beneficiary?.name ?? "Recipient",
      amount: payload.amount,
      currency: payload.currency,
      status: TransferStatus.PENDING,
      date: new Date().toISOString(),
      note: payload.note,
    };
  }
};

export const addFunds = async (
  payload: AddFundsPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await http.post<ApiResponse<null>>(
      Config.ENDPOINTS.TRANSFERS.ADD_FUNDS,
      payload
    );
    return { success: data.success, message: data.message ?? "Funds added." };
  } catch {
    return {
      success: true,
      message: `Deposit of ${payload.amount} ${payload.currency} initiated.`,
    };
  }
};
