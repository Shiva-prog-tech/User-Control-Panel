// Domain types owned by the Accounts module.

export enum AccountType {
  REWARD = "REWARD",
  PLATFORM = "PLATFORM",
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
}

