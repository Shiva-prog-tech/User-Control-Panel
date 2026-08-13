// Types with no single owning module: the API envelope, the signed-in user,
// and the chart point shared by Dashboard and Analytics.
// Everything else lives in its module: modules/<Module>/types.ts.

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

export interface SpendingTrendPoint {
  month: string; // e.g. "Jan"
  amount: number;
}
