'use client';

import React, { useState } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StripeCheckout from './StripeCheckout';
import PaystackCheckout from './PaystackCheckout';
import { PaymentIconsGroup, CARD_PAYMENT_METHODS, PAYSTACK_METHODS } from './PaymentIcons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  packageName: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
  currency,
  customerEmail,
  customerName,
  customerPhone,
  packageName,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Determine default payment provider based on currency
  const defaultProvider = ['NGN', 'GHS', 'ZAR', 'KES'].includes(currency.toUpperCase())
    ? 'paystack'
    : 'stripe';

  const handleClose = () => {
    if (isProcessing) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseConfirmation(false);
    onClose();
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setIsProcessing(false);
    onSuccess(paymentId);
    onClose();
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    onError(error);
  };

  const formatCurrency = (value: number) => {
    return `${currency} ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Complete Payment</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{packageName}</h3>
              <Badge variant="outline" className="bg-white">
                Booking #{bookingId.slice(0, 8).toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <Lock className="w-4 h-4 text-green-600" />
            <span>Secure payment powered by Stripe & Paystack</span>
          </div>

          {/* Payment Tabs */}
          <Tabs defaultValue={defaultProvider} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="stripe" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                International Cards
              </TabsTrigger>
              <TabsTrigger value="paystack" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                African Methods
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stripe" className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Accepted Cards</p>
                <PaymentIconsGroup methods={CARD_PAYMENT_METHODS} size="md" />
              </div>
              <StripeCheckout
                bookingId={bookingId}
                amount={amount}
                currency={currency}
                customerEmail={customerEmail}
                customerName={customerName}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </TabsContent>

            <TabsContent value="paystack" className="space-y-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Accepted Methods</p>
                <PaymentIconsGroup methods={PAYSTACK_METHODS} size="md" />
              </div>
              <PaystackCheckout
                bookingId={bookingId}
                amount={amount}
                currency={currency}
                customerEmail={customerEmail}
                customerName={customerName}
                customerPhone={customerPhone}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
            <p>Your payment information is encrypted and secure.</p>
            <p className="mt-1">By completing this payment, you agree to our Terms of Service.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <Dialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Payment?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Your payment is currently being processed. Are you sure you want to cancel?
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowCloseConfirmation(false)}
            >
              Continue Payment
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmClose}
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

