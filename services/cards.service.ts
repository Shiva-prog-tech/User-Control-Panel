import http from "@/utils/axios";
import Config from "@/utils/Config";
import { ApiResponse, CardModel } from "@/types/global";
import { CardKind, CardStatus } from "@/types/constants";

export interface UpdateCardStatusPayload {
  status: CardStatus;
}

export interface UpdateCardLimitPayload {
  spendLimit: number;
}

// Mock fallback until the API is live — the two active cards from the designs.
const MOCK_CARDS: CardModel[] = [
  {
    id: "card_001",
    holderName: "Ankiit Nallwa",
    last4: "4821",
    brand: "VISA",
    kind: CardKind.VIRTUAL,
    status: CardStatus.ACTIVE,
    expiryMonth: 9,
    expiryYear: 2028,
    balance: 0.9,
    spendLimit: 1000,
    currency: "USD",
  },
  {
    id: "card_002",
    holderName: "Ankiit Nallwa",
    last4: "7310",
    brand: "MASTERCARD",
    kind: CardKind.PHYSICAL,
    status: CardStatus.ACTIVE,
    expiryMonth: 3,
    expiryYear: 2029,
    balance: 0.43,
    spendLimit: 2500,
    currency: "USD",
  },
];

export const getCards = async (): Promise<CardModel[]> => {
  try {
    const { data } = await http.get<ApiResponse<CardModel[]>>(
      Config.ENDPOINTS.CARDS.LIST
    );
    return data.data;
  } catch {
    return MOCK_CARDS;
  }
};

export const getCardById = async (id: string): Promise<CardModel | null> => {
  try {
    const { data } = await http.get<ApiResponse<CardModel>>(
      Config.ENDPOINTS.CARDS.DETAILS(id)
    );
    return data.data;
  } catch {
    return MOCK_CARDS.find((item) => item.id === id) ?? null;
  }
};

export const updateCardStatus = async (
  id: string,
  payload: UpdateCardStatusPayload
): Promise<CardModel | null> => {
  try {
    const { data } = await http.patch<ApiResponse<CardModel>>(
      Config.ENDPOINTS.CARDS.STATUS(id),
      payload
    );
    return data.data;
  } catch {
    const card = MOCK_CARDS.find((item) => item.id === id);
    return card ? { ...card, status: payload.status } : null;
  }
};

export const updateCardLimit = async (
  id: string,
  payload: UpdateCardLimitPayload
): Promise<CardModel | null> => {
  try {
    const { data } = await http.patch<ApiResponse<CardModel>>(
      Config.ENDPOINTS.CARDS.LIMIT(id),
      payload
    );
    return data.data;
  } catch {
    const card = MOCK_CARDS.find((item) => item.id === id);
    return card ? { ...card, spendLimit: payload.spendLimit } : null;
  }
};
