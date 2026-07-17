"use client";

import Image from "next/image";
import Link from "next/link";
import { AccountType, ROUTES } from "@/types/constants";
import { Account } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import {
  ChevronRightIcon,
  CryptoIcon,
  RewardIcon,
  WalletIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./AccountsPanel.module.scss";

interface AccountsPanelProps {
  accounts: Account[];
}

const iconForType = (type: AccountType): string => {
  switch (type) {
    case AccountType.REWARD:
      return RewardIcon;
    case AccountType.PLATFORM:
      return CryptoIcon;
    default:
      return WalletIcon;
  }
};

const AccountsPanel = ({ accounts }: AccountsPanelProps) => {
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Accounts</h2>
        <Link href={ROUTES.ACCOUNTS} className={styles.viewAll}>
          View All
          <Image src={ChevronRightIcon} alt="" width={15} height={15} />
        </Link>
      </div>

      <div className={styles.list}>
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={ROUTES.ACCOUNTS}
            className={styles.row}
          >
            <span className={styles.iconChip}>
              <Image
                src={iconForType(account.type)}
                alt=""
                width={18}
                height={18}
              />
            </span>
            <span className={styles.meta}>
              <span className={styles.name}>{account.name}</span>
              <span className={styles.type}>{account.type}</span>
            </span>
            <span className={styles.balance}>
              {formatCurrency(account.balance, account.currency)}
            </span>
            <Image src={ChevronRightIcon} alt="" width={16} height={16} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AccountsPanel;
