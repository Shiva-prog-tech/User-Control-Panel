// App-wide constant values. Module-specific enums live alongside their
// module's models in modules/<Module>/types.ts.

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
