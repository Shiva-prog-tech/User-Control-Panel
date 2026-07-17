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

export const logoutUser = async (): Promise<void> => {
  try {
    await http.post(Config.ENDPOINTS.AUTH.LOGOUT);
  } catch {
    // Best-effort — local state is cleared by the auth slice regardless.
  }
};
