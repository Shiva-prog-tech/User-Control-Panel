"use client";

import Image from "next/image";
import { classNames } from "@/utils/helper";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  accent: "teal" | "purple" | "amber";
}

const ACCENT_CLASS: Record<StatCardProps["accent"], string> = {
  teal: "accentTeal",
  purple: "accentPurple",
  amber: "accentAmber",
};

const StatCard = ({ label, value, icon, accent }: StatCardProps) => {
  return (
    <section
      className={classNames(styles.card, styles[ACCENT_CLASS[accent]])}
    >
      <div className={styles.meta}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
      </div>
      <span className={styles.iconChip}>
        <Image src={icon} alt="" width={20} height={20} />
      </span>
    </section>
  );
};

export default StatCard;
