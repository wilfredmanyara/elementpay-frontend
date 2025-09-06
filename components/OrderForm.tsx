"use client";

import { useState } from "react";
import Select, { StylesConfig, GroupBase } from "react-select";

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

interface OptionType {
  value: string;
  label: string;
}

const currencyOptions: OptionType[] = [
  { value: "KES", label: "KES" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const tokenOptions: OptionType[] = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "ETH", label: "ETH" },
];

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

  const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      width: "100%",
      padding: "8px",
      borderRadius: "16px",
      border:
        errors.currency || errors.token
          ? "1px solid #ef4444"
          : "1px solid #e5e7eb",
      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      "&:hover": {
        borderColor: "#9ca3af",
      },
      "&:focus-within": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    }),
    option: (
      base,
      state
    ) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6",
      },
    }),
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-div">
        <label htmlFor="amount">Amount *</label>
        <input
          type="number"
          id="amount"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: parseFloat(e.target.value) || 0,
            })
          }
          className={errors.amount ? "border-red-500" : ""}
          placeholder="Enter amount"
          disabled={disabled}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
        )}
      </div>

      <div className="form-div">
        <label htmlFor="currency">Currency *</label>
        <Select
          options={currencyOptions}
          value={
            currencyOptions.find(
              (option) => option.value === formData.currency
            ) || null
          }
          onChange={(selectedOption) =>
            setFormData({ ...formData, currency: selectedOption?.value || "" })
          }
          placeholder="Select currency"
          isDisabled={disabled}
          styles={customStyles}
          isClearable
        />
        {errors.currency && (
          <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
        )}
      </div>

      <div className="form-div">
        <label htmlFor="token">Token *</label>
        <Select
          options={tokenOptions}
          value={
            tokenOptions.find((option) => option.value === formData.token) ||
            null
          }
          onChange={(selectedOption) =>
            setFormData({ ...formData, token: selectedOption?.value || "" })
          }
          placeholder="Select token"
          isDisabled={disabled}
          styles={customStyles}
          isClearable
        />
        {errors.token && (
          <p className="text-red-500 text-sm mt-1">{errors.token}</p>
        )}
      </div>

      <div className="form-div">
        <label htmlFor="note">Note (optional)</label>
        <textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Add a note (optional)"
          rows={3}
          disabled={disabled}
        />
      </div>

      <button type="submit" disabled={disabled} className="primary-button">
        {disabled ? "Processing..." : "Create Order"}
      </button>
    </form>
  );
}
