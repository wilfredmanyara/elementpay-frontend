import { Order, orders } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';

interface OrderRequest {
  amount: number;
  currency: string;
  token: string;
  note?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();
    
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'invalid_amount', message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }
    
    if (!body.currency) {
      return NextResponse.json(
        { error: 'invalid_currency', message: 'Currency is required' },
        { status: 400 }
      );
    }
    
    if (!body.token) {
      return NextResponse.json(
        { error: 'invalid_token', message: 'Token is required' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ord_0x${Math.random().toString(16).substring(2, 8)}`;
    // const orderId = "ord_0xabc123";(for testing webhooks)
    
    const order: Order = {
      order_id: orderId,
      // order_id: "ord_0xabc123",(for testing webhooks)
      status: 'created',
      amount: body.amount,
      currency: body.currency,
      token: body.token,
      note: body.note || "",
      created_at: new Date().toISOString(),
    };
    
    // Store order
    orders.set(orderId, order);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
