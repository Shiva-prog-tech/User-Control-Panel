// Central, env-driven configuration. All endpoints and keys are read from here —
// never hardcode URLs or storage keys inside components/services.

const Config = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Swipeo",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.swipeo.io/v1",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.swipeo.io",
  SESSION_TIMEOUT_MINUTES: Number(
    process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES ?? 30
  ),
  AMCHARTS_LICENSE: process.env.NEXT_PUBLIC_AMCHARTS_LICENSE ?? "",

  // QR sign-in: how long a scanned code stays valid before the web page
  // rotates to a fresh one, and how often it polls the backend for approval.
  QR_SESSION_TTL_MS: Number(process.env.NEXT_PUBLIC_QR_SESSION_TTL_MS ?? 12_000),
  QR_POLL_INTERVAL_MS: Number(
    process.env.NEXT_PUBLIC_QR_POLL_INTERVAL_MS ?? 2_500
  ),
  // Dev-only: with no backend, auto-approve the mock session after this many
  // ms so the scan→login→redirect path is demonstrable. 0 keeps it pending.
  QR_MOCK_APPROVE_MS: Number(process.env.NEXT_PUBLIC_QR_MOCK_APPROVE_MS ?? 0),

  STORAGE_KEYS: {
    AUTH_TOKEN: "swipeo_auth_token",
    PERSIST_ROOT: "swipeo-root",
  },

  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/signup",
      FORGOT_PASSWORD: "/auth/forgot-password",
      LOGOUT: "/auth/logout",
      QR_CREATE: "/auth/qr-session",
      QR_STATUS: (token: string) => `/auth/qr-session/${token}`,
    },
    DASHBOARD: {
      OVERVIEW: "/dashboard/overview",
    },
    ACCOUNTS: {
      LIST: "/accounts",
      DETAILS: (id: string) => `/accounts/${id}`,
    },
    CARDS: {
      LIST: "/cards",
      DETAILS: (id: string) => `/cards/${id}`,
      STATUS: (id: string) => `/cards/${id}/status`,
      LIMIT: (id: string) => `/cards/${id}/limit`,
    },
    TRANSFERS: {
      LIST: "/transfers",
      SEND: "/transfers/send",
      ADD_FUNDS: "/transfers/add-funds",
      BENEFICIARIES: "/transfers/beneficiaries",
    },
    TRANSACTIONS: {
      LIST: "/transactions",
      DETAILS: (id: string) => `/transactions/${id}`,
    },
    ANALYTICS: {
      SUMMARY: "/analytics/summary",
    },
    VERIFICATION: {
      STATUS: "/verification/status",
      DOCUMENTS: "/verification/documents",
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
      READ: (id: string) => `/notifications/${id}/read`,
      READ_ALL: "/notifications/read-all",
    },
    USER: {
      PROFILE: "/user/profile",
      SETTINGS: "/user/settings",
    },
  },
} as const;

export default Config;
