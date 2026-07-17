"use client";

import Image from "next/image";
import { AppLogoIcon } from "@/utils/ImageRelativePaths";
import styles from "./AuthBrandPanel.module.scss";

const FEATURES = [
  "PCI-DSS Level 1 Compliant",
  "Real-time Transaction Monitoring",
  "Multi-currency Support",
  "Advanced Fraud Detection",
];

const AuthBrandPanel = () => {
  return (
    <aside className={styles.panel}>
      <div className={styles.brand}>
        <Image src={AppLogoIcon} alt="Swipeo logo" width={36} height={36} />
        <span className={styles.wordmark}>Swipeo</span>
      </div>

      <div className={styles.hero}>
        <h2 className={styles.title}>Enterprise Banking Platform</h2>
        <p className={styles.subtitle}>
          Secure, scalable, and compliant financial infrastructure for modern
          businesses.
        </p>
        <ul className={styles.features}>
          {FEATURES.map((feature) => (
            <li key={feature} className={styles.feature}>
              <span className={styles.dot} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.footer}>© 2026 Swipeo. All rights reserved.</p>
    </aside>
  );
};

export default AuthBrandPanel;
