"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/Components/Sidebar";
import Header from "@/Components/Header";
import { AUTH_ROUTES } from "@/types/constants";
import styles from "./LayoutWrapper.module.scss";

// Renders the authenticated app shell (sidebar + header) around page content,
// or the bare page for auth routes (login / signup / forgot password).
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
