// App-wide constant values and enums.

export const POPUPS = {
  SEND_MONEY: "sendMoneyPopUp",
  ADD_FUNDS: "addFundsPopUp",
  MANAGE_CARDS: "manageCardsPopUp",
} as const;

export type PopUpName = (typeof POPUPS)[keyof typeof POPUPS];

export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  ACCOUNTS: "/accounts",
  CARDS: "/cards",
  CARD_DETAILS: (id: string) => `/cards/${id}`,
  TRANSFERS: "/transfers",
  TRANSACTIONS: "/transactions",
  ANALYTICS: "/analytics",
  VERIFICATION: "/verification",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  HELP: "/help",
} as const;

// Routes rendered without the authenticated app shell (sidebar + header).
export const AUTH_ROUTES: string[] = [
  ROUTES.ROOT,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
];

export enum AccountType {
  REWARD = "REWARD",
  PLATFORM = "PLATFORM",
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
}

export enum CardStatus {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  BLOCKED = "BLOCKED",
}

export enum CardKind {
  VIRTUAL = "VIRTUAL",
  PHYSICAL = "PHYSICAL",
}

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export enum TransferStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum VerificationStepStatus {
  COMPLETED = "COMPLETED",
  IN_REVIEW = "IN_REVIEW",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  NOT_STARTED = "NOT_STARTED",
}

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  PROMOTION = "PROMOTION",
}
