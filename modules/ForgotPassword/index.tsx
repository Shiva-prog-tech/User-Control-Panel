"use client";

import AuthBrandPanel from "@/Components/AuthBrandPanel";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
  return (
    <div className={styles.screen}>
      <AuthBrandPanel />
      <div className={styles.formSide}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;
