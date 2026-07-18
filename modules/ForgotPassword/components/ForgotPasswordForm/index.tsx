"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthInput from "@/Components/AuthScreen/components/AuthInput";
import { forgotPassword } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import { LockIcon, MailIcon } from "@/utils/ImageRelativePaths";
import styles from "./ForgotPasswordForm.module.scss";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter the email you signed up with.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await forgotPassword({ email: email.trim() });
    setSubmitting(false);
    setMessage(result.message);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.subtitle}>
        Enter your email and we&apos;ll send you a reset link
      </p>

      {message ? (
        <div className={styles.successBanner} role="status">
          {message}
        </div>
      ) : (
        <>
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          )}

          <AuthInput
            icon={MailIcon}
            placeholder="Email Address"
            autoComplete="email"
            type="email"
            value={email}
            onChange={setEmail}
          />

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting && <span className={styles.spinner} />}
            Send reset link
          </button>
        </>
      )}

      <p className={styles.backLine}>
        <Link href={ROUTES.LOGIN} className={styles.linkBtn}>
          ← Back to sign in
        </Link>
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
