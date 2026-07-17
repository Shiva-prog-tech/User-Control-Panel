"use client";

import { classNames } from "@/utils/helper";
import styles from "./Loader.module.scss";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  label?: string;
}

const Loader = ({ size = "md", fullPage = false, label }: LoaderProps) => {
  const spinner = (
    <div className={styles.wrap}>
      <span className={classNames(styles.spinner, styles[size])} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );

  if (fullPage) {
    return <div className={styles.fullPage}>{spinner}</div>;
  }

  return spinner;
};

export default Loader;
