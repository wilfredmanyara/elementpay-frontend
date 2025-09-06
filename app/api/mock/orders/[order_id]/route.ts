import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/orders';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  try {
    const { order_id: orderId } = await params;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'invalid_order_id', message: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    const order = orders.get(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'order_not_found', message: `No order with id ${orderId}` },
        { status: 404 }
      );
    }
    
    // Calculate time-based status
    const createdAt = new Date(order.created_at);
    const now = new Date();
    const secondsElapsed = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
    
    let status: 'created' | 'processing' | 'settled' | 'failed' = 'created';
    
    if (secondsElapsed >= 18) {
      // 80% settled, 20% failed
      status = Math.random() < 0.8 ? 'settled' : 'failed';
    } else if (secondsElapsed >= 8) {
      status = 'processing';
    }
    
    // Update order status
    const updatedOrder = { ...order, status };
    orders.set(orderId, updatedOrder);
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
