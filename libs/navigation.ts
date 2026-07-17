// Sidebar navigation registry — single source of truth for the app shell menu.

import { ROUTES } from "@/types/constants";
import {
  AccountsIcon,
  AnalyticsIcon,
  CardsIcon,
  DashboardIcon,
  HelpIcon,
  NotificationsIcon,
  SettingsIcon,
  TransactionsIcon,
  TransfersIcon,
  VerificationIcon,
} from "@/utils/ImageRelativePaths";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: DashboardIcon },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: AccountsIcon },
  { label: "Cards", href: ROUTES.CARDS, icon: CardsIcon },
  { label: "Transfers", href: ROUTES.TRANSFERS, icon: TransfersIcon },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: TransactionsIcon },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: AnalyticsIcon },
  { label: "Verification", href: ROUTES.VERIFICATION, icon: VerificationIcon },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Notifications", href: ROUTES.NOTIFICATIONS, icon: NotificationsIcon },
  { label: "Settings", href: ROUTES.SETTINGS, icon: SettingsIcon },
  { label: "Help", href: ROUTES.HELP, icon: HelpIcon },
];
