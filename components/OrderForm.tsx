"use client";

import { useState } from "react";

interface OrderFormProps {
  onSubmit: (formData: OrderRequest) => void;
  disabled?: boolean;
}

export interface OrderRequest {
  amount: number;
  currency: string;
  token: string;
  note?: string;
}

interface FormErrors {
  amount?: string;
  currency?: string;
  token?: string;
}

export default function OrderForm({ onSubmit, disabled }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderRequest>({
    amount: 0,
    currency: "",
    token: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    }
    if (!formData.token) {
      newErrors.token = "Token is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-900 mb-1">
          Amount *
        </label>
        <input
          type="number"
          id="amount"
          value={formData.amount || ""}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter amount"
          disabled={disabled}
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      {/* Currency */}
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-900 mb-1">
          Currency *
        </label>
        <select
          id="currency"
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.currency ? "border-red-500" : "border-gray-300"
          }`}
          disabled={disabled}
        >
          <option value="KES">KES</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency}</p>}
      </div>

      {/* Token */}
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-900 mb-1">
          Token *
        </label>
        <select
          id="token"
          value={formData.token}
          onChange={(e) => setFormData({ ...formData, token: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.token ? "border-red-500" : "border-gray-300"
          }`}
          disabled={disabled}
        >
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
          <option value="ETH">ETH</option>
        </select>
        {errors.token && <p className="text-red-500 text-sm mt-1">{errors.token}</p>}
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-900 mb-1">
          Note (optional)
        </label>
        <textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a note (optional)"
          rows={3}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {disabled ? "Processing..." : "Create Order"}
      </button>
    </form>
  );
}
