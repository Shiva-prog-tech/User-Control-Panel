"use client";

import AuthBrandPanel from "@/Components/AuthBrandPanel";
import LoginForm from "./components/LoginForm";
import styles from "./Login.module.scss";

const Login = () => {
  return (
    <div className={styles.screen}>
      <AuthBrandPanel />
      <div className={styles.formSide}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
