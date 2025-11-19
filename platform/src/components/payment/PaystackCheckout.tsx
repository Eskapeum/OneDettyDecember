'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle,
  ExternalLink,
  Shield
} from 'lucide-react';

interface PaystackCheckoutProps {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

export default function PaystackCheckout({
  bookingId,
  amount,
  currency,
  customerEmail,
  customerName,
  customerPhone,
  onSuccess,
  onError,
}: PaystackCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Debit/Credit Card',
      description: 'Visa, Mastercard, Verve',
      icon: <CreditCard className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: <Building2 className="h-5 w-5" />,
      available: true,
    },
    {
      id: 'ussd',
      name: 'USSD',
      description: 'Pay with your phone',
      icon: <Smartphone className="h-5 w-5" />,
      available: currency === 'NGN',
    },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    const currencyMap: Record<string, string> = {
      'NGN': '₦',
      'GHS': '₵',
      'USD': '$',
      'ZAR': 'R',
    };

    const symbol = currencyMap[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const initializePayment = async () => {
    try {
      setIsInitializing(true);
      setError(null);

      const response = await fetch('/api/payments/paystack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      setAuthorizationUrl(data.authorizationUrl);
      setReference(data.reference);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePaymentRedirect = () => {
    if (!authorizationUrl) return;

    // Open payment page in new window
    const paymentWindow = window.open(
      authorizationUrl,
      'paystack-payment',
      'width=500,height=700,scrollbars=yes,resizable=yes'
    );

    // Poll for payment completion
    const pollPayment = setInterval(() => {
      if (paymentWindow?.closed) {
        clearInterval(pollPayment);
        verifyPayment();
      }
    }, 1000);

    // Set timeout to stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollPayment);
      if (paymentWindow && !paymentWindow.closed) {
        paymentWindow.close();
      }
    }, 600000);
  };

  const verifyPayment = async () => {
    if (!reference) return;

    try {
      setIsLoading(true);

      const response = await fetch(`/api/payments/paystack?reference=${reference}&action=verify`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      if (data.verification.status === 'success') {
        setPaymentSuccess(true);
        onSuccess(reference);
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-green-700 mb-4">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Reference: {reference}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img 
            src="https://paystack.com/assets/img/logo/paystack-icon-blue.png" 
            alt="Paystack" 
            className="h-6 w-6"
          />
          Pay with Paystack
        </CardTitle>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(amount, currency)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Methods */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Available Payment Methods</h4>
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center gap-3 p-3 border rounded-lg ${
                method.available 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-100 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-gray-600">{method.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-sm">{method.name}</div>
                <div className="text-xs text-gray-500">{method.description}</div>
              </div>
              {method.available && (
                <Badge variant="secondary" className="text-xs">
                  Available
                </Badge>
              )}
            </div>
          ))}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <Shield className="h-4 w-4" />
          <span>Secured by Paystack with bank-level security</span>
        </div>

        {/* Payment Button */}
        {!authorizationUrl ? (
          <Button
            onClick={initializePayment}
            disabled={isInitializing}
            className="w-full"
            size="lg"
          >
            {isInitializing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              `Pay ${formatCurrency(amount, currency)}`
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handlePaymentRedirect}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Continue to Payment
                </>
              )}
            </Button>
            
            <Button
              onClick={verifyPayment}
              variant="outline"
              className="w-full"
              size="sm"
            >
              I've completed payment - Verify
            </Button>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          By completing this payment, you agree to our Terms of Service and Privacy Policy.
        </p>

        {/* Supported Countries */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Supported in:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {['🇳🇬 Nigeria', '🇬🇭 Ghana', '🇿🇦 South Africa', '🇰🇪 Kenya'].map((country) => (
              <Badge key={country} variant="outline" className="text-xs">
                {country}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
