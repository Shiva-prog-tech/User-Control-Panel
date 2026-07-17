"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/Components/Button";
import { forgotPassword } from "@/services/auth.service";
import { ROUTES } from "@/types/constants";
import { LockIcon, MailIcon } from "@/utils/ImageRelativePaths";
import styles from "./ForgotPasswordForm.module.scss";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Reset your password</h1>
      <p className={styles.subheading}>
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Email Address</span>
              <div className={styles.inputWrap}>
                <Image src={MailIcon} alt="" width={17} height={17} />
                <input
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </label>

            <Button type="submit" fullWidth loading={submitting}>
              Send reset link
            </Button>
          </form>
        </>
      )}

      <p className={styles.backLine}>
        <Link href={ROUTES.LOGIN} className={styles.inlineLink}>
          ← Back to sign in
        </Link>
      </p>

      <p className={styles.ssl}>
        <Image src={LockIcon} alt="" width={13} height={13} />
        256-bit SSL encryption
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
