import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Generic popup visibility state. Every modal / drawer / sidebar overlay in the
// app is driven by a boolean key here, toggled via showPopUp(name) / hidePopUp(name).
export interface PopUpsState {
  [popUpName: string]: boolean;
}

const initialState: PopUpsState = {};

const PopUpsSlice = createSlice({
  name: "popUps",
  initialState,
  reducers: {
    showPopUp: (state, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    hidePopUp: (state, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    hideAllPopUps: () => initialState,
  },
});

export const { showPopUp, hidePopUp, hideAllPopUps } = PopUpsSlice.actions;
export default PopUpsSlice.reducer;
