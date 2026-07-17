"use client";

import { useEffect, useState } from "react";
import Button from "@/Components/Button";
import Loader from "@/Components/Loader";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications.service";
import { NotificationItem } from "@/types/global";
import NotificationRow from "./components/NotificationRow";
import styles from "./Notifications.module.scss";

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const data = await getNotifications();
      if (active) {
        setNotifications(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setMarkingAll(false);
  };

  if (loading) {
    return <Loader fullPage label="Loading notifications" />;
  }

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>Notifications</h1>
            <p className={styles.subtitle}>
              {unreadCount > 0
                ? `You have ${unreadCount} unread ${
                    unreadCount === 1 ? "notification" : "notifications"
                  }`
                : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              loading={markingAll}
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className={styles.empty}>No notifications yet.</p>
        ) : (
          <ul className={styles.list}>
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Notifications;
