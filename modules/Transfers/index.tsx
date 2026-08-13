"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { Account } from "@/modules/Accounts/types";
import { Beneficiary, Transfer } from "@/modules/Transfers/types";
import { getAccounts } from "@/services/accounts.service";
import {
  getBeneficiaries,
  getRecentTransfers,
} from "@/services/transfers.service";
import TransferForm from "./components/TransferForm";
import BeneficiariesList from "./components/BeneficiariesList";
import RecentTransfers from "./components/RecentTransfers";
import styles from "./Transfers.module.scss";

const Transfers = () => {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [accountsData, beneficiariesData, transfersData] =
          await Promise.all([
            getAccounts(),
            getBeneficiaries(),
            getRecentTransfers(),
          ]);
        if (!active) return;
        setAccounts(accountsData);
        setBeneficiaries(beneficiariesData);
        setTransfers(transfersData);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const handleTransferCreated = (transfer: Transfer) => {
    setTransfers((prev) => [transfer, ...prev]);
  };

  if (loading) {
    return <Loader fullPage label="Loading transfers..." />;
  }

  return (
    <div className={styles.transfers}>
      <header className={styles.pageHead}>
        <span className={styles.eyebrow}>Payments</span>
        <h1 className={styles.title}>Transfers</h1>
        <p className={styles.subtitle}>
          Send money to saved beneficiaries and keep track of recent activity.
        </p>
      </header>

      <div className={styles.grid}>
        <TransferForm
          accounts={accounts}
          beneficiaries={beneficiaries}
          onTransferCreated={handleTransferCreated}
        />
        <div className={styles.sideColumn}>
          <BeneficiariesList beneficiaries={beneficiaries} />
          <RecentTransfers transfers={transfers} />
        </div>
      </div>
    </div>
  );
};

export default Transfers;
