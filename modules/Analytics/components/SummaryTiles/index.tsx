"use client";

import Image from "next/image";
import { classNames, formatCurrency } from "@/utils/helper";
import { TrendUpIcon, WalletIcon } from "@/utils/ImageRelativePaths";
import styles from "./SummaryTiles.module.scss";

interface SummaryTilesProps {
  totalSpent: number;
  totalIncome: number;
}

const SummaryTiles = ({ totalSpent, totalIncome }: SummaryTilesProps) => (
  <div className={styles.tiles}>
    <article className={classNames(styles.tile, styles.spent)}>
      <div className={styles.info}>
        <span className={styles.label}>Spent this month</span>
        <span className={styles.value}>{formatCurrency(totalSpent)}</span>
      </div>
      <span className={classNames(styles.chip, styles.tealChip)}>
        <Image src={TrendUpIcon} alt="" width={18} height={18} />
      </span>
    </article>
    <article className={classNames(styles.tile, styles.income)}>
      <div className={styles.info}>
        <span className={styles.label}>Income this month</span>
        <span className={styles.value}>{formatCurrency(totalIncome)}</span>
      </div>
      <span className={classNames(styles.chip, styles.purpleChip)}>
        <Image src={WalletIcon} alt="" width={18} height={18} />
      </span>
    </article>
  </div>
);

export default SummaryTiles;
