"use client";

import { Beneficiary } from "@/types/global";
import { getInitials } from "@/utils/helper";
import styles from "./BeneficiariesList.module.scss";

interface BeneficiariesListProps {
  beneficiaries: Beneficiary[];
}

const BeneficiariesList = ({ beneficiaries }: BeneficiariesListProps) => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Beneficiaries</h2>

      {beneficiaries.length === 0 ? (
        <p className={styles.empty}>No beneficiaries saved yet.</p>
      ) : (
        <ul className={styles.list}>
          {beneficiaries.map((beneficiary) => (
            <li key={beneficiary.id} className={styles.row}>
              <span className={styles.avatar}>
                {getInitials(beneficiary.name)}
              </span>
              <div className={styles.meta}>
                <span className={styles.name}>{beneficiary.name}</span>
                <span className={styles.detail}>
                  {beneficiary.bankName} · {beneficiary.accountNumber}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BeneficiariesList;
