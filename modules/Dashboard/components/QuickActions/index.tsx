"use client";

import Image from "next/image";
import { useAppDispatch } from "@/redux/hooks";
import { showPopUp } from "@/redux/reducers/PopUpsReducer";
import { POPUPS } from "@/types/constants";
import { classNames } from "@/utils/helper";
import {
  AddFundsIcon,
  AppLogoIcon,
  CardsIcon,
  ChevronRightIcon,
  SendIcon,
} from "@/utils/ImageRelativePaths";
import styles from "./QuickActions.module.scss";

interface QuickAction {
  label: string;
  icon: string;
  chipClass: string;
  popUpName: string;
}

const QuickActions = () => {
  const dispatch = useAppDispatch();

  const actions: QuickAction[] = [
    {
      label: "Send Money",
      icon: SendIcon,
      chipClass: styles.chipTeal,
      popUpName: POPUPS.SEND_MONEY,
    },
    {
      label: "Add Funds",
      icon: AddFundsIcon,
      chipClass: styles.chipPurple,
      popUpName: POPUPS.ADD_FUNDS,
    },
    {
      label: "Manage Cards",
      icon: CardsIcon,
      chipClass: styles.chipIndigo,
      popUpName: POPUPS.MANAGE_CARDS,
    },
  ];

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <Image src={AppLogoIcon} alt="" width={22} height={22} />
        <h2 className={styles.title}>Quick Actions</h2>
      </div>

      <div className={styles.list}>
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={styles.action}
            onClick={() => dispatch(showPopUp(action.popUpName))}
          >
            <span className={classNames(styles.chip, action.chipClass)}>
              <Image src={action.icon} alt="" width={18} height={18} />
            </span>
            <span className={styles.label}>{action.label}</span>
            <Image src={ChevronRightIcon} alt="" width={16} height={16} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
