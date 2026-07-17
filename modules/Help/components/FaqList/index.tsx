"use client";

import { useState } from "react";
import Image from "next/image";
import { classNames } from "@/utils/helper";
import { ChevronDownIcon } from "@/utils/ImageRelativePaths";
import styles from "./FaqList.module.scss";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "How do I add funds to my account?",
    answer:
      "Open Quick Actions on the dashboard and choose Add Funds, or use the Add funds button on any account card. You can top up via bank transfer, card, or crypto — bank transfers usually arrive within one business day.",
  },
  {
    question: "How do I freeze or unfreeze a card?",
    answer:
      "Go to Cards and use the Freeze card button next to the card you want to pause, or use Manage Cards in Quick Actions. Freezing blocks all new payments instantly and can be undone at any time.",
  },
  {
    question: "How long does verification take?",
    answer:
      "Email verification is instant. Identity and address documents are usually reviewed within 24 hours. You can track each step on the Verification page.",
  },
  {
    question: "What are the transfer limits?",
    answer:
      "Standard accounts can send up to $10,000 per month. Completing the Source of funds verification step raises this limit. Individual transfers above $5,000 may require additional confirmation.",
  },
  {
    question: "What fees does Swipeo charge?",
    answer:
      "Internal transfers between Swipeo accounts are free. Outgoing bank transfers cost a flat $0.50. Card payments carry no fee, and crypto top-ups use the network fee only.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Use the Contact support form on this page or email support@swipeo.io. Our team replies within 24 hours, seven days a week.",
  },
];

const FaqList = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Frequently asked questions</h2>

      <ul className={styles.list}>
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <li key={faq.question} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                <Image
                  className={classNames(
                    styles.chevron,
                    isOpen && styles.chevronOpen
                  )}
                  src={ChevronDownIcon}
                  alt=""
                  width={18}
                  height={18}
                />
              </button>
              {isOpen && <p className={styles.answer}>{faq.answer}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FaqList;
