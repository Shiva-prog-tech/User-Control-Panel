"use client";

import { useState } from "react";
import Image from "next/image";
import { classNames } from "@/utils/helper";
import { EyeIcon, EyeOffIcon } from "@/utils/ImageRelativePaths";
import styles from "./AuthInput.module.scss";

interface AuthInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  withToggle?: boolean;
  className?: string;
}

// Rounded pill input with a leading icon; optional password visibility toggle.
const AuthInput = ({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  withToggle = false,
  className,
}: AuthInputProps) => {
  const [visible, setVisible] = useState(false);

  const resolvedType = withToggle ? (visible ? "text" : "password") : type;

  return (
    <div
      className={classNames(
        styles.field,
        withToggle && styles.withToggle,
        className
      )}
    >
      <span className={styles.iconWrap}>
        <Image src={icon} alt="" width={18} height={18} />
      </span>
      <input
        type={resolvedType}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
      />
      {withToggle && (
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Image
            src={visible ? EyeOffIcon : EyeIcon}
            alt=""
            width={18}
            height={18}
          />
        </button>
      )}
    </div>
  );
};

export default AuthInput;
