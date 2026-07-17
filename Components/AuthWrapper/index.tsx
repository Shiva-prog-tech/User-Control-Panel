"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { AUTH_ROUTES, ROUTES } from "@/types/constants";

// Global route guard: bounces unauthenticated users to /login and
// authenticated users away from the auth screens.
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isAuthenticated && !isAuthRoute) {
      router.replace(ROUTES.LOGIN);
    } else if (isAuthenticated && isAuthRoute) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isAuthRoute, router]);

  return <>{children}</>;
};

export default AuthWrapper;
