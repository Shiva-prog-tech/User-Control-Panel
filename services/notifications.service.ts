import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, NotificationItem } from "@/types/global";
import { NotificationType } from "@/types/constants";

// Mock fallback until the API is live.
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "ntf_001",
    title: "Cashback credited",
    message: "You received $0.17 cashback in your Reward Account.",
    date: "2026-07-14T09:30:00.000Z",
    read: false,
    type: NotificationType.TRANSACTION,
  },
  {
    id: "ntf_002",
    title: "New sign-in detected",
    message: "A new sign-in from Chrome on Windows was detected.",
    date: "2026-07-13T21:12:00.000Z",
    read: false,
    type: NotificationType.SECURITY,
  },
  {
    id: "ntf_003",
    title: "Verification update",
    message: "Your proof of address is under review.",
    date: "2026-07-10T15:00:00.000Z",
    read: true,
    type: NotificationType.SYSTEM,
  },
  {
    id: "ntf_004",
    title: "Card spending limit",
    message: "Your VISA •••• 4821 is close to its monthly limit.",
    date: "2026-07-02T08:45:00.000Z",
    read: true,
    type: NotificationType.TRANSACTION,
  },
];

export const getNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const { data } = await http.get<ApiResponse<NotificationItem[]>>(
      Config.ENDPOINTS.NOTIFICATIONS.LIST
    );
    return data.data;
  } catch {
    return MOCK_NOTIFICATIONS;
  }
};

export const markNotificationRead = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const { data } = await http.patch<ApiResponse<null>>(
      Config.ENDPOINTS.NOTIFICATIONS.READ(id)
    );
    return { success: data.success };
  } catch {
    return { success: true };
  }
};

export const markAllNotificationsRead = async (): Promise<{ success: boolean }> => {
  try {
    const { data } = await http.patch<ApiResponse<null>>(
      Config.ENDPOINTS.NOTIFICATIONS.READ_ALL
    );
    return { success: data.success };
  } catch {
    return { success: true };
  }
};
