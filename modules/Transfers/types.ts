// Domain types owned by the Transfers module.

export enum TransferStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
}

export interface Transfer {
  id: string;
  recipientName: string;
  amount: number;
  currency: string;
  status: TransferStatus;
  date: string;
  note?: string;
}
