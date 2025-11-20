'use client';

import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';

export type PaymentMethodType = 
  | 'visa' 
  | 'mastercard' 
  | 'amex' 
  | 'discover'
  | 'bank_transfer'
  | 'mobile_money'
  | 'ussd'
  | 'card';

interface PaymentIconProps {
  method: PaymentMethodType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface PaymentIconsGroupProps {
  methods: PaymentMethodType[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function PaymentIcon({ method, size = 'md', className = '' }: PaymentIconProps) {
  const iconSize = iconSizes[size];

  switch (method) {
    case 'visa':
      return (
        <div className={`${sizeClasses[size]} ${className} flex items-center`} title="Visa">
          <svg viewBox="0 0 48 32" className="h-full w-auto">
            <rect width="48" height="32" rx="4" fill="#1434CB"/>
            <text x="24" y="20" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
          </svg>
        </div>
      );

    case 'mastercard':
      return (
        <div className={`${sizeClasses[size]} ${className} flex items-center`} title="Mastercard">
          <svg viewBox="0 0 48 32" className="h-full w-auto">
            <rect width="48" height="32" rx="4" fill="#EB001B"/>
            <circle cx="18" cy="16" r="8" fill="#FF5F00"/>
            <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
          </svg>
        </div>
      );

    case 'amex':
      return (
        <div className={`${sizeClasses[size]} ${className} flex items-center`} title="American Express">
          <svg viewBox="0 0 48 32" className="h-full w-auto">
            <rect width="48" height="32" rx="4" fill="#006FCF"/>
            <text x="24" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">AMEX</text>
          </svg>
        </div>
      );

    case 'discover':
      return (
        <div className={`${sizeClasses[size]} ${className} flex items-center`} title="Discover">
          <svg viewBox="0 0 48 32" className="h-full w-auto">
            <rect width="48" height="32" rx="4" fill="#FF6000"/>
            <text x="24" y="20" fontSize="9" fill="white" textAnchor="middle" fontWeight="bold">DISCOVER</text>
          </svg>
        </div>
      );

    case 'bank_transfer':
      return (
        <div className={`${className} flex items-center gap-1`} title="Bank Transfer">
          <Building2 size={iconSize} className="text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Bank</span>
        </div>
      );

    case 'mobile_money':
      return (
        <div className={`${className} flex items-center gap-1`} title="Mobile Money">
          <Smartphone size={iconSize} className="text-green-600" />
          <span className="text-xs font-medium text-gray-700">Mobile</span>
        </div>
      );

    case 'ussd':
      return (
        <div className={`${className} flex items-center gap-1`} title="USSD">
          <Wallet size={iconSize} className="text-purple-600" />
          <span className="text-xs font-medium text-gray-700">USSD</span>
        </div>
      );

    case 'card':
    default:
      return (
        <div className={`${className} flex items-center gap-1`} title="Credit/Debit Card">
          <CreditCard size={iconSize} className="text-gray-600" />
          <span className="text-xs font-medium text-gray-700">Card</span>
        </div>
      );
  }
}

export function PaymentIconsGroup({ methods, size = 'md', className = '' }: PaymentIconsGroupProps) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {methods.map((method, index) => (
        <PaymentIcon key={`${method}-${index}`} method={method} size={size} />
      ))}
    </div>
  );
}

// Preset groups for common use cases
export const CARD_PAYMENT_METHODS: PaymentMethodType[] = ['visa', 'mastercard', 'amex', 'discover'];
export const PAYSTACK_METHODS: PaymentMethodType[] = ['card', 'bank_transfer', 'mobile_money', 'ussd'];
export const ALL_PAYMENT_METHODS: PaymentMethodType[] = [
  'visa',
  'mastercard',
  'amex',
  'discover',
  'bank_transfer',
  'mobile_money',
  'ussd',
];

// Example usage component
export function AcceptedPaymentMethods() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600 mb-2">International Cards</p>
        <PaymentIconsGroup methods={CARD_PAYMENT_METHODS} size="md" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">African Payment Methods</p>
        <PaymentIconsGroup methods={PAYSTACK_METHODS} size="md" />
      </div>
    </div>
  );
}

