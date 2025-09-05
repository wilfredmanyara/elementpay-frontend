"use client";

interface OrderTimeoutProps {
  onRetry: () => void;
}

export default function OrderTimeout({ onRetry }: OrderTimeoutProps) {
  return (
    <div className="main-section">
      <div className="gradient-border max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-badge-yellow mb-6">
          <svg
            className="w-8 h-8 text-badge-yellow-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mb-6">Timed Out</h1>
        <p className="text-dark-200 mb-8">
          The order processing timed out. Please try again.
        </p>
        <button onClick={onRetry} className="primary-button">
          Retry
        </button>
      </div>
    </div>
  );
}
