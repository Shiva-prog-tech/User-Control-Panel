"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useOutsideClick from "@/customHooks/useOutsideClick";
import useSessionTimer from "@/customHooks/useSessionTimer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/AuthReducer";
import { logoutUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import { classNames, getGreeting, getInitials } from "@/utils/helper";
import {
  BellIcon,
  ChevronDownIcon,
  ClockIcon,
  SearchIcon,
  ShieldIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./Header.module.scss";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.ACCOUNTS]: "Accounts",
  [ROUTES.CARDS]: "Cards",
  [ROUTES.TRANSFERS]: "Transfers",
  [ROUTES.TRANSACTIONS]: "Transactions",
  [ROUTES.ANALYTICS]: "Analytics",
  [ROUTES.VERIFICATION]: "Verification",
  [ROUTES.NOTIFICATIONS]: "Notifications",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.HELP]: "Help",
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { formatted } = useSessionTimer();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuRef, () => setMenuOpen(false));

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest User";
  const isDashboard = pathname.startsWith(ROUTES.DASHBOARD);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await logoutUser();
    dispatch(logout());
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header className={styles.header}>
      <div className={styles.pageTitle}>
        {isDashboard ? (
          <>
            <h1>
              {getGreeting()}, {user?.firstName ?? "there"}
            </h1>
            <p>Here&apos;s your financial overview</p>
          </>
        ) : (
          <h1>{PAGE_TITLES[pathname] ?? "Overview"}</h1>
        )}
      </div>

      <div className={styles.actions}>
        <span className={styles.securePill}>
          <Image src={ShieldIcon} alt="" width={14} height={14} />
          Secure
        </span>

        <span className={styles.timerPill} title="Session time remaining">
          <Image src={ClockIcon} alt="" width={14} height={14} />
          {formatted}
        </span>

        <div className={styles.search}>
          <Image src={SearchIcon} alt="" width={16} height={16} />
          <input type="text" placeholder="Search" aria-label="Search" />
          <kbd>⌘K</kbd>
        </div>

        <Link
          href={ROUTES.NOTIFICATIONS}
          className={styles.bell}
          aria-label="Notifications"
        >
          <Image src={BellIcon} alt="" width={18} height={18} />
          <span className={styles.bellDot} />
        </Link>

        <div className={styles.userMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.userButton}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.avatar}>{getInitials(fullName)}</span>
            <span className={styles.userName}>{fullName}</span>
            <Image src={ChevronDownIcon} alt="" width={14} height={14} />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <Link
                href={ROUTES.SETTINGS}
                className={styles.dropdownItem}
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <Link
                href={ROUTES.VERIFICATION}
                className={styles.dropdownItem}
                onClick={() => setMenuOpen(false)}
              >
                Verification
              </Link>
              <button
                type="button"
                className={classNames(styles.dropdownItem, styles.danger)}
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
