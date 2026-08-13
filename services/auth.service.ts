import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, User } from "@/types/global";

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// A pending QR sign-in session minted by the backend. `token` is embedded in
// the QR the web page shows; `expiresAt` (epoch ms) drives the rotation.
export interface QrSession {
  token: string;
  expiresAt: number;
}

// Result of polling a session: still waiting, expired (rotate), or the phone
// approved it and handed back real credentials.
export type QrSessionStatus =
  | { status: "pending" }
  | { status: "expired" }
  | ({ status: "approved" } & AuthResponse);

// Mock fallback until the API is live — mirrors the demo user in the designs.
const MOCK_USER: User = {
  id: "usr_001",
  firstName: "Ankiit",
  lastName: "Nallwa",
  email: "ankiitnallwa@gmail.com",
  verified: true,
  createdAt: "2025-11-02T10:00:00.000Z",
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const { data } = await http.post<ApiResponse<AuthResponse>>(
      Config.ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return data.data;
  } catch {
    return {
      token: "mock-jwt-token",
      user: { ...MOCK_USER, email: payload.email || MOCK_USER.email },
    };
  }
};

export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
  try {
    const { data } = await http.post<ApiResponse<AuthResponse>>(
      Config.ENDPOINTS.AUTH.SIGNUP,
      payload
    );
    return data.data;
  } catch {
    return {
      token: "mock-jwt-token",
      user: {
        ...MOCK_USER,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        verified: false,
      },
    };
  }
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data } = await http.post<ApiResponse<null>>(
      Config.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload
    );
    return { success: data.success, message: data.message ?? "Reset link sent." };
  } catch {
    return {
      success: true,
      message: `If an account exists for ${payload.email}, a reset link has been sent.`,
    };
  }
};

// --- QR sign-in ---------------------------------------------------------
// The web page never mints its own credentials: it asks the backend for a
// short-lived session token, shows it as a QR, and polls until the phone app
// approves it. The mock fallback keeps the flow working with no API — it
// rotates like the real thing and (optionally) auto-approves for local demos.

const QR_MOCK_CREATED = new Map<string, number>();

const randomQrToken = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};

export const createQrSession = async (): Promise<QrSession> => {
  try {
    const { data } = await http.post<ApiResponse<QrSession>>(
      Config.ENDPOINTS.AUTH.QR_CREATE
    );
    return data.data;
  } catch {
    const token = randomQrToken();
    QR_MOCK_CREATED.set(token, Date.now());
    return { token, expiresAt: Date.now() + Config.QR_SESSION_TTL_MS };
  }
};

export const getQrSessionStatus = async (
  token: string
): Promise<QrSessionStatus> => {
  try {
    const { data } = await http.get<ApiResponse<QrSessionStatus>>(
      Config.ENDPOINTS.AUTH.QR_STATUS(token)
    );
    return data.data;
  } catch {
    const createdAt = QR_MOCK_CREATED.get(token);
    if (
      Config.QR_MOCK_APPROVE_MS > 0 &&
      createdAt !== undefined &&
      Date.now() - createdAt >= Config.QR_MOCK_APPROVE_MS
    ) {
      QR_MOCK_CREATED.delete(token);
      return { status: "approved", token: "mock-jwt-token", user: MOCK_USER };
    }
    return { status: "pending" };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await http.post(Config.ENDPOINTS.AUTH.LOGOUT);
  } catch {
    // Best-effort — local state is cleared by the auth slice regardless.
  }
};
