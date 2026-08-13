// Domain types owned by the Notifications module.

export enum NotificationType {
  TRANSACTION = "TRANSACTION",
  SECURITY = "SECURITY",
  SYSTEM = "SYSTEM",
  PROMOTION = "PROMOTION",
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
}
