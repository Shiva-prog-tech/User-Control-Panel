"use client";

import DataTable, { DataTableColumn } from "@/Components/DataTable";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/modules/Transactions/types";
import { classNames, formatCurrency, formatDate } from "@/utils/helper";
import styles from "./TransactionsTable.module.scss";

interface TransactionsTableProps {
  transactions: Transaction[];
}

const STATUS_CLASS: Record<TransactionStatus, string> = {
  [TransactionStatus.COMPLETED]: "statusCompleted",
  [TransactionStatus.PENDING]: "statusPending",
  [TransactionStatus.FAILED]: "statusFailed",
};

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      render: (txn) => (
        <span className={styles.date}>{formatDate(txn.date)}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (txn) => (
        <span className={styles.description}>
          <span className={styles.descriptionText}>{txn.description}</span>
          <span className={styles.merchant}>{txn.merchant}</span>
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (txn) => <span className={styles.categoryPill}>{txn.category}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (txn) => (
        <span
          className={classNames(
            styles.statusPill,
            styles[STATUS_CLASS[txn.status]]
          )}
        >
          {txn.status}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (txn) => (
        <span
          className={classNames(
            styles.amount,
            txn.type === TransactionType.CREDIT && styles.amountCredit
          )}
        >
          {txn.type === TransactionType.CREDIT ? "+" : "-"}
          {formatCurrency(txn.amount, txn.currency)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      rowKey={(txn) => txn.id}
      emptyMessage="No transactions match your filters."
    />
  );
};

export default TransactionsTable;
