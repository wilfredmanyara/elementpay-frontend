export type OrderStatus = 'created' | 'processing' | 'settled' | 'failed';

export interface Order {
  order_id: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  token: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export const orders = new Map<string, Order>();
