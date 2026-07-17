"use client";

import { ButtonHTMLAttributes } from "react";
import { classNames } from "@/utils/helper";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = ({
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} />}
      {children}
    </button>
  );
};

export default Button;
