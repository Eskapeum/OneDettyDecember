'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentDetails {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  createdAt: string;
  booking: {
    id: string;
    packageName: string;
    startDate: string;
    endDate: string;
    customerEmail: string;
  };
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id as string;

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleDownloadReceipt = () => {
    // TODO: Implement PDF download
    window.print();
  };

  const handleViewBooking = () => {
    if (payment?.bookingId) {
      router.push(`/bookings/${payment.bookingId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce-once">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Your booking has been confirmed
          </p>
        </div>

        {/* Payment Details Card */}
        <Card className="mb-6 shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center justify-between">
              <span>Payment Confirmation</span>
              <Badge variant="default" className="bg-green-600">
                Paid
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {payment && (
              <div className="space-y-4">
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
                    <p className="text-sm text-gray-500">Amount Paid</p>
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
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(payment.booking.startDate).toLocaleDateString()} - {new Date(payment.booking.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <span className="text-gray-700">
                  A confirmation email has been sent to <strong>{payment?.booking.customerEmail}</strong>
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <span className="text-gray-700">
                  Your booking is confirmed and ready for your trip
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleViewBooking}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
            size="lg"
          >
            View Booking Details
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="flex-1 border-gray-300"
            size="lg"
          >
            <Download className="mr-2 w-5 h-5" />
            Download Receipt
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-out;
        }
      `}</style>
    </div>
  );
}

