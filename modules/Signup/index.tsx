"use client";

import AuthBrandPanel from "@/Components/AuthBrandPanel";
import SignupForm from "./components/SignupForm";
import styles from "./Signup.module.scss";

const Signup = () => {
  return (
    <div className={styles.screen}>
      <AuthBrandPanel />
      <div className={styles.formSide}>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
