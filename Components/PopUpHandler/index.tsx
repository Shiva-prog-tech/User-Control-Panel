"use client";

import { useAppSelector } from "@/redux/hooks";
import { POPUPS } from "@/types/constants";
import SendMoneyPopUp from "@/Components/SendMoneyPopUp";
import AddFundsPopUp from "@/Components/AddFundsPopUp";
import ManageCardsPopUp from "@/Components/ManageCardsPopUp";

// Single global mount point for every popup in the app.
// Visibility is driven entirely by the PopUps redux slice.
const PopUpHandler = () => {
  const popUps = useAppSelector((state) => state.popUps);

  return (
    <>
      {popUps[POPUPS.SEND_MONEY] && <SendMoneyPopUp />}
      {popUps[POPUPS.ADD_FUNDS] && <AddFundsPopUp />}
      {popUps[POPUPS.MANAGE_CARDS] && <ManageCardsPopUp />}
    </>
  );
};

export default PopUpHandler;
