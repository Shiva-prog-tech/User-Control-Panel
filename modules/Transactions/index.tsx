"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "@/modules/Transactions/types";
import { getTransactions } from "@/services/transactions.service";
import TransactionFilters from "./components/TransactionFilters";
import TransactionsTable from "./components/TransactionsTable";
import styles from "./Transactions.module.scss";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "">("");
  const [type, setType] = useState<TransactionType | "">("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTransactions({ search, status, type })
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setInitialLoad(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [search, status, type]);

  if (initialLoad && loading) {
    return <Loader fullPage label="Loading transactions" />;
  }

  return (
    <div className={styles.transactions}>
      <div className={styles.header}>
        <div>
          <span className={styles.kicker}>Activity</span>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.subtitle}>
            Track and filter every debit and credit across your accounts.
          </p>
        </div>
        <span className={styles.countPill}>
          {transactions.length}{" "}
          {transactions.length === 1 ? "transaction" : "transactions"}
        </span>
      </div>

      <section className={styles.card}>
        <TransactionFilters
          status={status}
          type={type}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTypeChange={setType}
        />
        {loading ? (
          <div className={styles.refetching}>
            <Loader size="sm" label="Updating results" />
          </div>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </section>
    </div>
  );
};

export default Transactions;
