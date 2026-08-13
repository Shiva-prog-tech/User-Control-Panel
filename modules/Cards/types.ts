// Domain types owned by the Cards module (shared with CardDetails and the
// Manage Cards popup).

export enum CardStatus {
  ACTIVE = "ACTIVE",
  FROZEN = "FROZEN",
  BLOCKED = "BLOCKED",
}

export enum CardKind {
  VIRTUAL = "VIRTUAL",
  PHYSICAL = "PHYSICAL",
}

export interface CardModel {
  id: string;
  holderName: string;
  last4: string;
  brand: "VISA" | "MASTERCARD";
  kind: CardKind;
  status: CardStatus;
  expiryMonth: number;
  expiryYear: number;
  balance: number;
  spendLimit: number;
  currency: string;
}
