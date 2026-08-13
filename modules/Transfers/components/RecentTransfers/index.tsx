"use client";

import { Transfer, TransferStatus } from "@/modules/Transfers/types";
import { classNames, formatCurrency, formatDate } from "@/utils/helper";
import styles from "./RecentTransfers.module.scss";

interface RecentTransfersProps {
  transfers: Transfer[];
}

const STATUS_CLASS: Record<TransferStatus, string> = {
  [TransferStatus.COMPLETED]: "statusCompleted",
  [TransferStatus.PENDING]: "statusPending",
  [TransferStatus.FAILED]: "statusFailed",
};

const RecentTransfers = ({ transfers }: RecentTransfersProps) => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent transfers</h2>

      {transfers.length === 0 ? (
        <p className={styles.empty}>No transfers yet.</p>
      ) : (
        <ul className={styles.list}>
          {transfers.map((transfer) => (
            <li key={transfer.id} className={styles.row}>
              <div className={styles.meta}>
                <span className={styles.name}>{transfer.recipientName}</span>
                <span className={styles.date}>{formatDate(transfer.date)}</span>
              </div>
              <div className={styles.right}>
                <span className={styles.amount}>
                  -{formatCurrency(transfer.amount, transfer.currency)}
                </span>
                <span
                  className={classNames(
                    styles.statusPill,
                    styles[STATUS_CLASS[transfer.status]]
                  )}
                >
                  {transfer.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecentTransfers;
