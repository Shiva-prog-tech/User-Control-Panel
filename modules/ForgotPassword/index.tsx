"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/types/constants";
import Config from "@/utils/Config";
import { AppLogoIcon } from "@/utils/ImageRelativePaths";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import styles from "./ForgotPassword.module.scss";

// Static sibling of the sliding AuthScreen: same gradient circle and panel
// styling on the left, form over the glass backdrop on the right.
const ForgotPassword = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          <div className={styles.panelBrand}>
            <Image src={AppLogoIcon} alt="" width={38} height={38} />
            <span>{Config.APP_NAME}</span>
          </div>
          <h3 className={styles.panelTitle}>Remembered your password?</h3>
          <p className={styles.panelText}>
            Sign in to access your Swipeo account.
          </p>
          <Link href={ROUTES.LOGIN} className={styles.panelBtn}>
            Sign in
          </Link>
        </div>
      </div>

      <div className={styles.formSide}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
