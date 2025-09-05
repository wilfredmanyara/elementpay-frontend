# ElementPay Frontend Assessment

A Next.js application that allows users to connect wallets, create orders, and track order status through polling and webhook notifications.

## Features

- ✅ Multi-wallet connection (MetaMask, WalletConnect, etc.)
- ✅ Order creation with form validation
- ✅ Real-time order status polling
- ✅ Webhook endpoint with HMAC verification
- ✅ Race condition handling between polling and webhooks
- ✅ Timeout handling with retry functionality
- ✅ Responsive UI with loading states and error handling

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Wallet Integration**: RainbowKit + Wagmi + Viem
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd elementpay-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required for webhook HMAC verification
WEBHOOK_SECRET=shh_super_secret

# Optional: WalletConnect Project ID for additional wallet support
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## API Endpoints

### Mock API

#### 1. Create Order
- **POST** `/api/mock/orders/create`
- **Body**: 
  ```json
  {
    "amount": 1500,
    "currency": "KES",
    "token": "USDC",
    "note": "optional"
  }
  ```
- **Response**:
  ```json
  {
    "order_id": "ord_0xabc123",
    "status": "created",
    "amount": 1500,
    "currency": "KES",
    "token": "USDC",
    "created_at": "2025-09-02T10:00:00Z"
  }
  ```

#### 2. Get Order Status
- **GET** `/api/mock/orders/:order_id`
- **Behavior**:
  - 0-7s → `created`
  - 8-17s → `processing`
  - ≥18s → `settled` (80%) or `failed` (20%)

### Webhooks

#### ElementPay Webhook
- **POST** `/api/webhooks/elementpay`
- **Headers**: `X-Webhook-Signature: t=<unix_ts>,v1=<base64sig>`
- **Body**:
  ```json
  {
    "type": "order.settled",
    "data": {
      "order_id": "ord_0xabc123",
      "status": "settled"
    }
  }
  ```

## Webhook Testing

### Valid Webhook (should return 2xx):
```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000000,v1=9ylbFTfko9hM6OoVTP8WpZz28Zt+TzSHHkFrylDokRo=' \
  -d '{"type":"order.settled","data":{"order_id":"ord_0xabc123","status":"settled"}}'
```

### Invalid Signature (should return 401/403):
```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1710000300,v1=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=' \
  -d '{"type":"order.failed","data":{"order_id":"ord_0xabc123","status":"failed"}}'
```

### Expired Timestamp (should return 401):
```bash
curl -X POST http://localhost:3000/api/webhooks/elementpay \
  -H 'Content-Type: application/json' \
  -H 'X-Webhook-Signature: t=1709990000,v1=3QXTcQv0m0h4QkQ0L0w9ZsH1YFhZgMGnF0d9Xz4P7nQ=' \
  -d '{"type":"order.processing","data":{"order_id":"ord_0xabc123","status":"processing"}}'
```

## Application Flow

1. **Wallet Connection**: Users connect their wallet using RainbowKit (supports MetaMask, WalletConnect, etc.)
2. **Order Creation**: Form is enabled only when wallet is connected
3. **Order Processing**: 
   - Order is created via POST request
   - Processing modal appears immediately
   - Status is polled every 3 seconds
   - Webhook notifications are also monitored
4. **Race Condition Handling**: First final status (settled/failed) wins, duplicates are ignored
5. **Timeout**: If no final status after 60 seconds, timeout screen appears with retry option
6. **Receipt**: Final status is displayed with order details

## Architecture Notes

### Key Components

- **Navigation**: Header with wallet connection and page navigation
- **OrderPage**: Main order creation and status tracking component
- **Wallet Integration**: RainbowKit provider with multiple wallet support

### State Management

- React hooks for local component state
- Refs for tracking finalization state and cleanup
- Custom polling and webhook listening logic

### Security

- HMAC-SHA256 webhook signature verification
- Constant-time comparison for signatures
- Timestamp freshness validation (5-minute window)
- Raw body verification for webhook payloads

### Error Handling

- Form validation with inline error messages
- API error responses with proper status codes
- Network error handling in polling
- Graceful timeout and retry mechanisms

## Project Structure

```
app/
├── api/
│   ├── mock/
│   │   └── orders/
│   │       ├── create/route.ts
│   │       └── [order_id]/route.ts
│   └── webhooks/
│       └── elementpay/route.ts
├── orders/page.tsx
├── wallet/page.tsx
├── layout.tsx
└── page.tsx
components/
├── Navigation.tsx
└── Wallet.tsx
types/
└── index.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

Modern browsers with ES2020+ support. The application uses:
- WebCrypto API for HMAC verification
- Fetch API for HTTP requests
- Modern React features (hooks, suspense)

## Known Limitations

- In-memory storage for orders (resets on server restart)
- Simulated webhook events (real implementation would use WebSockets or SSE)
- No persistence layer (orders are lost on page refresh)

## Future Enhancements

- Database integration for order persistence
- Real-time WebSocket connections for instant updates
- Order history and search functionality
- Enhanced error recovery mechanisms
- User authentication and order ownership
