"use client";

import Image from "next/image";
import TiltCard from "@/Components/TiltCard";
import useCountUp from "@/customHooks/useCountUp";
import { classNames, formatCurrency } from "@/utils/helper";
import { TrendUpIcon, WalletIcon } from "@/utils/ImageRelativePaths";
import styles from "./SummaryTiles.module.scss";

interface SummaryTilesProps {
  totalSpent: number;
  totalIncome: number;
}

const SummaryTiles = ({ totalSpent, totalIncome }: SummaryTilesProps) => {
  const animatedSpent = useCountUp(totalSpent);
  const animatedIncome = useCountUp(totalIncome);

  return (
    <div className={styles.tiles}>
      <TiltCard>
        <article className={classNames(styles.tile, styles.spent)}>
          <div className={styles.info}>
            <span className={styles.label}>Spent this month</span>
            <span className={styles.value}>
              {formatCurrency(animatedSpent)}
            </span>
          </div>
          <span className={classNames(styles.chip, styles.tealChip)}>
            <Image src={TrendUpIcon} alt="" width={18} height={18} />
          </span>
        </article>
      </TiltCard>
      <TiltCard>
        <article className={classNames(styles.tile, styles.income)}>
          <div className={styles.info}>
            <span className={styles.label}>Income this month</span>
            <span className={styles.value}>
              {formatCurrency(animatedIncome)}
            </span>
          </div>
          <span className={classNames(styles.chip, styles.purpleChip)}>
            <Image src={WalletIcon} alt="" width={18} height={18} />
          </span>
        </article>
      </TiltCard>
    </div>
  );
};

export default SummaryTiles;
