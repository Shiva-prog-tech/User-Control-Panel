"use client";

import Image from "next/image";
import TiltCard from "@/Components/TiltCard";
import useCountUp from "@/customHooks/useCountUp";
import { formatCurrency } from "@/utils/helper";
import { WalletIcon } from "@/utils/ImageRelativePaths";
import styles from "./TotalBalanceCard.module.scss";

interface TotalBalanceCardProps {
  totalBalance: number;
  accountBalance: number;
  cardBalance: number;
}

const TotalBalanceCard = ({
  totalBalance,
  accountBalance,
  cardBalance,
}: TotalBalanceCardProps) => {
  const animatedBalance = useCountUp(totalBalance, 1100);

  return (
    <TiltCard>
      <section className={styles.card}>
        <div className={styles.label}>
          <span className={styles.iconChip}>
            <Image src={WalletIcon} alt="" width={18} height={18} />
          </span>
          Total Balance
        </div>

        <span className={styles.amount}>
          {formatCurrency(animatedBalance)}
        </span>

        <div className={styles.meta}>
          <p className={styles.description}>
            Combined balance across accounts and cards
          </p>
          <p className={styles.breakdown}>
            Account balance {formatCurrency(accountBalance)} · Card balance{" "}
            {formatCurrency(cardBalance)}
          </p>
        </div>
      </section>
    </TiltCard>
  );
};

export default TotalBalanceCard;
