import { NextRequest } from 'next/server';
import { addConnection, removeConnection } from '@/lib/webhookConnections';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('order_id');
  
  if (!orderId) {
    return new Response('Missing order_id parameter', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      addConnection(orderId, controller);
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', order_id: orderId })}\n\n`);
    },
    cancel() {
      removeConnection(orderId);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}