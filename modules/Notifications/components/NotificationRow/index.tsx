"use client";

import {
  NotificationItem,
  NotificationType,
} from "@/modules/Notifications/types";
import { classNames, formatDate } from "@/utils/helper";
import styles from "./NotificationRow.module.scss";

interface NotificationRowProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}

const TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.TRANSACTION]: "Transaction",
  [NotificationType.SECURITY]: "Security",
  [NotificationType.SYSTEM]: "System",
  [NotificationType.PROMOTION]: "Promotion",
};

const TYPE_CLASS: Record<NotificationType, string> = {
  [NotificationType.TRANSACTION]: "typeTransaction",
  [NotificationType.SECURITY]: "typeSecurity",
  [NotificationType.SYSTEM]: "typeSystem",
  [NotificationType.PROMOTION]: "typePromotion",
};

const NotificationRow = ({ notification, onMarkRead }: NotificationRowProps) => {
  return (
    <li
      className={classNames(styles.row, !notification.read && styles.unread)}
    >
      <span
        className={classNames(
          styles.dot,
          notification.read && styles.dotHidden
        )}
      />

      <div className={styles.body}>
        <div className={styles.topLine}>
          <span className={styles.title}>{notification.title}</span>
          <span
            className={classNames(
              styles.typePill,
              styles[TYPE_CLASS[notification.type]]
            )}
          >
            {TYPE_LABELS[notification.type]}
          </span>
        </div>
        <p className={styles.message}>{notification.message}</p>
        <span className={styles.date}>
          {formatDate(notification.date, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!notification.read && (
        <button
          type="button"
          className={styles.markRead}
          onClick={() => onMarkRead(notification.id)}
        >
          Mark read
        </button>
      )}
    </li>
  );
};

export default NotificationRow;
