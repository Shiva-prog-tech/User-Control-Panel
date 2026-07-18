"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/types/constants";
import Config from "@/utils/Config";
import { classNames } from "@/utils/helper";
import { AppLogoIcon } from "@/utils/ImageRelativePaths";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import styles from "./AuthScreen.module.scss";

export type AuthMode = "signin" | "signup";

interface AuthScreenProps {
  initialMode?: AuthMode;
}

const MODE_ROUTES: Record<AuthMode, string> = {
  signin: ROUTES.LOGIN,
  signup: ROUTES.SIGNUP,
};

// Combined sign-in / sign-up screen with the sliding gradient panel.
// Both forms are always mounted; toggling the mode animates the circle
// across and swaps the visible form. The URL is kept in sync via shallow
// history updates so /login and /signup stay linkable without remounting
// (which would cut the animation short).
const AuthScreen = ({ initialMode = "signin" }: AuthScreenProps) => {
  const pathname = usePathname();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Follow browser back/forward between /login and /signup.
  useEffect(() => {
    if (pathname === ROUTES.SIGNUP) {
      setMode("signup");
    } else if (pathname === ROUTES.LOGIN) {
      setMode("signin");
    }
  }, [pathname]);

  const switchMode = (next: AuthMode) => {
    if (next === mode) return;
    setMode(next);
    window.history.pushState(null, "", MODE_ROUTES[next]);
  };

  return (
    <div
      className={classNames(
        styles.authScreen,
        mode === "signup" && styles.signUpMode
      )}
    >
      <div className={styles.formsContainer}>
        <div className={styles.signinSignup}>
          <div className={classNames(styles.formWrap, styles.signInWrap)}>
            <SignInForm onSwitchToSignUp={() => switchMode("signup")} />
          </div>
          <div className={classNames(styles.formWrap, styles.signUpWrap)}>
            <SignUpForm onSwitchToSignIn={() => switchMode("signin")} />
          </div>
        </div>
      </div>

      <div className={styles.panelsContainer}>
        <div className={classNames(styles.panel, styles.leftPanel)}>
          <div className={styles.panelContent}>
            <div className={styles.panelBrand}>
              <Image src={AppLogoIcon} alt="" width={38} height={38} />
              <span>{Config.APP_NAME}</span>
            </div>
            <h3 className={styles.panelTitle}>New here?</h3>
            <p className={styles.panelText}>
              Open a Swipeo account in minutes — secure, scalable, and
              compliant banking for modern businesses.
            </p>
            <button
              type="button"
              className={styles.panelBtn}
              onClick={() => switchMode("signup")}
            >
              Sign up
            </button>
          </div>
        </div>

        <div className={classNames(styles.panel, styles.rightPanel)}>
          <div className={styles.panelContent}>
            <div className={styles.panelBrand}>
              <Image src={AppLogoIcon} alt="" width={38} height={38} />
              <span>{Config.APP_NAME}</span>
            </div>
            <h3 className={styles.panelTitle}>One of us?</h3>
            <p className={styles.panelText}>
              Welcome back! Sign in to access your Swipeo account.
            </p>
            <button
              type="button"
              className={styles.panelBtn}
              onClick={() => switchMode("signin")}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
