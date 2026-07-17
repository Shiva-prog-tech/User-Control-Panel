"use client";

import Image from "next/image";
import { CloseIcon } from "@/utils/ImageRelativePaths";
import styles from "./PopUpWrapper.module.scss";

interface PopUpWrapperProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

// Shared modal chrome: overlay, card, header with close button.
// Feature popups render their content as children.
const PopUpWrapper = ({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = 480,
}: PopUpWrapperProps) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog">
      <div className={styles.dialog} style={{ maxWidth }}>
        <div className={styles.head}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <Image src={CloseIcon} alt="" width={18} height={18} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default PopUpWrapper;
