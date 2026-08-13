"use client";

import { Account } from "@/modules/Accounts/types";
import { formatCurrency } from "@/utils/helper";
import styles from "./AccountsSummary.module.scss";

interface AccountsSummaryProps {
  accounts: Account[];
}

const AccountsSummary = ({ accounts }: AccountsSummaryProps) => {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const currency = accounts[0]?.currency ?? "USD";

  return (
    <section className={styles.summary}>
      <div className={styles.content}>
        <span className={styles.label}>Total across accounts</span>
        <span className={styles.total}>{formatCurrency(total, currency)}</span>
        <span className={styles.count}>
          <span className={styles.dot} />
          {accounts.length} active {accounts.length === 1 ? "account" : "accounts"}
        </span>
      </div>

      <svg
        className={styles.decor}
        viewBox="0 0 260 260"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="180"
          cy="80"
          r="110"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth="26"
        />
        <circle cx="210" cy="190" r="70" fill="rgba(16, 185, 129, 0.14)" />
        <circle
          cx="80"
          cy="220"
          r="46"
          stroke="rgba(16, 185, 129, 0.18)"
          strokeWidth="12"
        />
      </svg>
    </section>
  );
};

export default AccountsSummary;
