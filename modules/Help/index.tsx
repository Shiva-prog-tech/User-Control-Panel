"use client";

import FaqList from "./components/FaqList";
import ContactSupport from "./components/ContactSupport";
import styles from "./Help.module.scss";

const Help = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>How can we help?</h1>
        <p className={styles.subtitle}>
          Browse common questions or reach out to our support team.
        </p>
      </header>

      <div className={styles.grid}>
        <FaqList />
        <ContactSupport />
      </div>
    </div>
  );
};

export default Help;
