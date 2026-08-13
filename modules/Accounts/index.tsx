"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { Account } from "@/modules/Accounts/types";
import { getAccounts } from "@/services/accounts.service";
import AccountsSummary from "./components/AccountsSummary";
import AccountCard from "./components/AccountCard";
import styles from "./Accounts.module.scss";

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      const data = await getAccounts();
      if (active) {
        setAccounts(data);
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <Loader fullPage label="Loading accounts..." />;
  }

  return (
    <div className={styles.accounts}>
      <header className={styles.header}>
        <h1 className={styles.title}>Accounts</h1>
        <p className={styles.subtitle}>
          All your Swipeo balances, together in one place.
        </p>
      </header>

      <AccountsSummary accounts={accounts} />

      <section className={styles.grid}>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </section>
    </div>
  );
};

export default Accounts;
