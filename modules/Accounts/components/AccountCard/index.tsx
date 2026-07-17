"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/Components/Button";
import { useAppDispatch } from "@/redux/hooks";
import { showPopUp } from "@/redux/reducers/PopUpsReducer";
import { AccountType, POPUPS, ROUTES } from "@/types/constants";
import { Account } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import {
  AddFundsIcon,
  CryptoIcon,
  RewardIcon,
  SendIcon,
  WalletIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./AccountCard.module.scss";

const ICON_BY_TYPE: Record<AccountType, string> = {
  [AccountType.REWARD]: RewardIcon,
  [AccountType.PLATFORM]: CryptoIcon,
  [AccountType.CHECKING]: WalletIcon,
  [AccountType.SAVINGS]: WalletIcon,
};

const LABEL_BY_TYPE: Record<AccountType, string> = {
  [AccountType.REWARD]: "Reward",
  [AccountType.PLATFORM]: "Platform",
  [AccountType.CHECKING]: "Checking",
  [AccountType.SAVINGS]: "Savings",
};

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const pillClass =
    account.type === AccountType.REWARD
      ? styles.pillReward
      : account.type === AccountType.PLATFORM
        ? styles.pillPlatform
        : styles.pillDefault;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.identity}>
          <span className={styles.iconChip}>
            <Image
              src={ICON_BY_TYPE[account.type]}
              alt=""
              width={22}
              height={22}
            />
          </span>
          <span className={styles.nameBlock}>
            <span className={styles.name}>{account.name}</span>
            <span className={styles.accountNumber}>
              {account.accountNumber}
            </span>
          </span>
        </div>
        <span className={pillClass}>{LABEL_BY_TYPE[account.type]}</span>
      </div>

      <div className={styles.balanceBlock}>
        <span className={styles.balanceLabel}>Available balance</span>
        <span className={styles.balance}>
          {formatCurrency(account.balance, account.currency)}
        </span>
      </div>

      <div className={styles.footer}>
        <Button
          variant="ghost"
          onClick={() => dispatch(showPopUp(POPUPS.ADD_FUNDS))}
        >
          <Image src={AddFundsIcon} alt="" width={16} height={16} />
          Add funds
        </Button>
        <Button variant="ghost" onClick={() => router.push(ROUTES.TRANSFERS)}>
          <Image src={SendIcon} alt="" width={16} height={16} />
          Transfer
        </Button>
      </div>
    </article>
  );
};

export default AccountCard;
