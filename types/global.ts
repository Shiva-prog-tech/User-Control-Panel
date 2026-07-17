// Shared domain models used across modules, services, and redux slices.

import {
  AccountType,
  CardKind,
  CardStatus,
  NotificationType,
  TransactionStatus,
  TransactionType,
  TransferStatus,
  VerificationStepStatus,
} from "@/types/constants";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
}

export interface CardModel {
  id: string;
  holderName: string;
  last4: string;
  brand: "VISA" | "MASTERCARD";
  kind: CardKind;
  status: CardStatus;
  expiryMonth: number;
  expiryYear: number;
  balance: number;
  spendLimit: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  type: TransactionType;
  accountId: string;
  cardId?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
}

export interface Transfer {
  id: string;
  recipientName: string;
  amount: number;
  currency: string;
  status: TransferStatus;
  date: string;
  note?: string;
}

export interface SpendingTrendPoint {
  month: string; // e.g. "Jan"
  amount: number;
}

export interface DashboardOverview {
  totalBalance: number;
  accountBalance: number;
  cardBalance: number;
  monthlySpending: number;
  activeCards: number;
  totalCards: number;
  pendingAmount: number;
  sixMonthAverage: number;
  peakMonth: SpendingTrendPoint;
  spendingTrend: SpendingTrendPoint[];
  accounts: Account[];
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyComparisonPoint {
  month: string;
  spending: number;
  income: number;
}

export interface AnalyticsSummary {
  categories: CategorySpend[];
  monthlyComparison: MonthlyComparisonPoint[];
  trend: SpendingTrendPoint[];
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
}

export interface VerificationStep {
  id: string;
  label: string;
  description: string;
  status: VerificationStepStatus;
}

export interface VerificationStatus {
  level: number;
  overallStatus: VerificationStepStatus;
  steps: VerificationStep[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
}

export interface UserSettings {
  twoFactorEnabled: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  currency: string;
  language: string;
}
