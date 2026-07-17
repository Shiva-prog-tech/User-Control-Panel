"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavItem, PRIMARY_NAV, SECONDARY_NAV } from "@/libs/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/reducers/AuthReducer";
import { logoutUser } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import Config from "@/utils/Config";
import { classNames, getInitials } from "@/utils/helper";
import {
  AppLogoIcon,
  ChevronRightIcon,
  SignOutIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest User";

  const handleSignOut = async () => {
    await logoutUser();
    dispatch(logout());
    router.replace(ROUTES.LOGIN);
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={classNames(styles.navItem, isActive && styles.active)}
      >
        <Image src={item.icon} alt="" width={18} height={18} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Image src={AppLogoIcon} alt={Config.APP_NAME} width={40} height={40} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>{Config.APP_NAME}</span>
          <span className={styles.brandTag}>Banking</span>
        </div>
      </div>

      <span className={styles.menuLabel}>Menu</span>

      <nav className={styles.nav}>{PRIMARY_NAV.map(renderNavItem)}</nav>

      <div className={styles.divider} />

      <nav className={styles.nav}>{SECONDARY_NAV.map(renderNavItem)}</nav>

      <div className={styles.footer}>
        <Link href={ROUTES.SETTINGS} className={styles.userCard}>
          <span className={styles.avatar}>{getInitials(fullName)}</span>
          <span className={styles.userMeta}>
            <span className={styles.userName}>{user?.firstName ?? "Guest"}</span>
            <span className={styles.userEmail}>{user?.email ?? "—"}</span>
          </span>
          <Image src={ChevronRightIcon} alt="" width={16} height={16} />
        </Link>

        <button type="button" className={styles.signOut} onClick={handleSignOut}>
          <Image src={SignOutIcon} alt="" width={16} height={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
