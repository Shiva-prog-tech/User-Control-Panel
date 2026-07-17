import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, User, UserSettings } from "@/types/global";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Mock fallbacks until the API is live.
const MOCK_USER: User = {
  id: "usr_001",
  firstName: "Ankiit",
  lastName: "Nallwa",
  email: "ankiitnallwa@gmail.com",
  phone: "+91 98100 00000",
  verified: true,
  createdAt: "2025-11-02T10:00:00.000Z",
};

const MOCK_SETTINGS: UserSettings = {
  twoFactorEnabled: true,
  emailAlerts: true,
  pushAlerts: false,
  currency: "USD",
  language: "en",
};

export const getProfile = async (): Promise<User> => {
  try {
    const { data } = await http.get<ApiResponse<User>>(
      Config.ENDPOINTS.USER.PROFILE
    );
    return data.data;
  } catch {
    return MOCK_USER;
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<User> => {
  try {
    const { data } = await http.patch<ApiResponse<User>>(
      Config.ENDPOINTS.USER.PROFILE,
      payload
    );
    return data.data;
  } catch {
    return { ...MOCK_USER, ...payload };
  }
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const { data } = await http.get<ApiResponse<UserSettings>>(
      Config.ENDPOINTS.USER.SETTINGS
    );
    return data.data;
  } catch {
    return MOCK_SETTINGS;
  }
};

export const updateSettings = async (
  payload: Partial<UserSettings>
): Promise<UserSettings> => {
  try {
    const { data } = await http.patch<ApiResponse<UserSettings>>(
      Config.ENDPOINTS.USER.SETTINGS,
      payload
    );
    return data.data;
  } catch {
    return { ...MOCK_SETTINGS, ...payload };
  }
};
