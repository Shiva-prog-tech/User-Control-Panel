"use client";

import { TransactionStatus, TransactionType } from "@/types/constants";
import { Transaction } from "@/types/global";
import {
  classNames,
  formatCurrency,
  formatDate,
  getInitials,
} from "@/utils/helper";
import styles from "./ActivityTable.module.scss";

interface ActivityTableProps {
  transactions: Transaction[];
  holderName: string;
}

const STATUS_CLASS: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]: "statusCompleted",
  [TransactionStatus.PENDING]: "statusPending",
  [TransactionStatus.FAILED]: "statusFailed",
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]: "Completed",
  [TransactionStatus.PENDING]: "Pending",
  [TransactionStatus.FAILED]: "Failed",
};

// Curated gradients so every merchant gets a stable, luxurious avatar tint.
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #0ea5e9, #6366f1)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #0d9488)",
  "linear-gradient(135deg, #8b5cf6, #d946ef)",
  "linear-gradient(135deg, #1c1c1e, #52525b)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
] as const;

const gradientFor = (merchant: string): string => {
  let hash = 0;
  for (const char of merchant) {
    hash = (hash + char.charCodeAt(0)) % AVATAR_GRADIENTS.length;
  }
  return AVATAR_GRADIENTS[hash]!;
};

const formatTime = (iso: string): string =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

const ActivityTable = ({ transactions, holderName }: ActivityTableProps) => {
  if (transactions.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyBadge}>✦</span>
        <p className={styles.emptyTitle}>No activity on this card yet</p>
        <p className={styles.emptyHint}>
          Payments made with this card will appear here the moment they happen.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Used by</th>
            <th>Category</th>
            <th>Date &amp; time</th>
            <th>Status</th>
            <th className={styles.alignRight}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => {
            const isCredit = txn.type === TransactionType.CREDIT;
            return (
              <tr key={txn.id}>
                <td>
                  <span className={styles.merchantCell}>
                    <span
                      className={styles.avatar}
                      style={{ background: gradientFor(txn.merchant) }}
                      aria-hidden="true"
                    >
                      {getInitials(txn.merchant)}
                    </span>
                    <span className={styles.merchantInfo}>
                      <span className={styles.merchantName}>
                        {txn.merchant}
                      </span>
                      <span className={styles.merchantDesc}>
                        {txn.description}
                      </span>
                    </span>
                  </span>
                </td>
                <td>
                  <span className={styles.userCell}>
                    <span className={styles.userAvatar} aria-hidden="true">
                      {getInitials(holderName)}
                    </span>
                    <span className={styles.userName}>{holderName}</span>
                  </span>
                </td>
                <td>
                  <span className={styles.categoryPill}>{txn.category}</span>
                </td>
                <td>
                  <span className={styles.dateCell}>
                    <span className={styles.dateValue}>
                      {formatDate(txn.date)}
                    </span>
                    <span className={styles.timeValue}>
                      {formatTime(txn.date)}
                    </span>
                  </span>
                </td>
                <td>
                  <span
                    className={classNames(
                      styles.statusPill,
                      styles[STATUS_CLASS[txn.status]]
                    )}
                  >
                    <span className={styles.statusDot} />
                    {STATUS_LABEL[txn.status]}
                  </span>
                </td>
                <td className={styles.alignRight}>
                  <span
                    className={classNames(
                      styles.amount,
                      isCredit && styles.amountCredit
                    )}
                  >
                    {isCredit ? "+" : "−"}
                    {formatCurrency(txn.amount, txn.currency)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
