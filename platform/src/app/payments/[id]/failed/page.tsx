'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentDetails {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  errorMessage?: string;
  createdAt: string;
  booking: {
    id: string;
    packageName: string;
    customerEmail: string;
  };
}

export default function PaymentFailedPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    async function fetchPaymentDetails() {
      try {
        const response = await fetch(`/api/payments/${paymentId}`);
        if (response.ok) {
          const data = await response.json();
          setPayment(data);
        }
      } catch (error) {
        console.error('Failed to fetch payment details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);

  const handleRetryPayment = async () => {
    setRetrying(true);
    try {
      // Redirect back to payment page
      if (payment?.bookingId) {
        router.push(`/bookings/${payment.bookingId}/payment`);
      }
    } catch (error) {
      console.error('Failed to retry payment:', error);
    } finally {
      setRetrying(false);
    }
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:hello@onedettydecember.com?subject=Payment Failed - Help Needed';
  };

  const handleGoBack = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Error Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 animate-shake">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600">
            We couldn't process your payment
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6 shadow-lg border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
            <CardTitle className="flex items-center justify-between">
              <span>Payment Details</span>
              <Badge variant="destructive">
                Failed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {payment && (
              <div className="space-y-4">
                {payment.errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Reason:</strong> {payment.errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-semibold text-gray-900">{payment.booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment ID</p>
                    <p className="font-semibold text-gray-900">{payment.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900 text-xl">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">{payment.provider}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2">Package</p>
                  <p className="font-semibold text-gray-900 text-lg">{payment.booking.packageName}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Common Reasons */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Common Reasons for Payment Failure</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                Insufficient funds in your account
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                Incorrect card details or expired card
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                Card declined by your bank
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">•</span>
                Network or connection issues
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Alternative Payment Methods */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Try Alternative Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">
              We accept multiple payment methods:
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Credit/Debit Card</Badge>
              <Badge variant="outline">Bank Transfer</Badge>
              <Badge variant="outline">Mobile Money</Badge>
              <Badge variant="outline">USSD</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleRetryPayment}
            disabled={retrying}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            size="lg"
          >
            {retrying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 w-5 h-5" />
                Try Again
              </>
            )}
          </Button>
          <Button
            onClick={handleContactSupport}
            variant="outline"
            className="flex-1 border-gray-300"
            size="lg"
          >
            <Mail className="mr-2 w-5 h-5" />
            Contact Support
          </Button>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

