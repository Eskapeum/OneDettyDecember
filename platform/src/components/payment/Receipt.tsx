'use client';

import React from 'react';
import { Download, Mail, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface ReceiptData {
  paymentId: string;
  bookingId: string;
  transactionId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  packagePrice: number;
  serviceFee: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  status: string;
}

interface ReceiptProps {
  data: ReceiptData;
  onDownloadPDF?: () => void;
  onEmailReceipt?: () => void;
}

export default function Receipt({ data, onDownloadPDF, onEmailReceipt }: ReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return `${data.currency} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons - Hidden in print */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        {onEmailReceipt && (
          <Button
            onClick={onEmailReceipt}
            variant="outline"
            size="sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Receipt
          </Button>
        )}
        {onDownloadPDF && (
          <Button
            onClick={onDownloadPDF}
            variant="default"
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>

      {/* Receipt Card */}
      <Card className="shadow-lg print:shadow-none">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black print:bg-none print:text-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">OneDettyDecember</h1>
              <p className="text-sm opacity-90">Payment Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">RECEIPT</p>
              <p className="text-xs opacity-90">#{data.paymentId.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">BILLED TO</h3>
              <p className="font-semibold text-gray-900">{data.customerName}</p>
              <p className="text-sm text-gray-600">{data.customerEmail}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">PAYMENT DETAILS</h3>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-600">Date:</span>{' '}
                  <span className="font-semibold">{new Date(data.date).toLocaleDateString()}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Transaction ID:</span>{' '}
                  <span className="font-semibold">{data.transactionId}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Booking ID:</span>{' '}
                  <span className="font-semibold">{data.bookingId}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Payment Method:</span>{' '}
                  <span className="font-semibold capitalize">{data.paymentMethod}</span>
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Itemized Breakdown */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">ITEMIZED BREAKDOWN</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{data.packageName}</p>
                  <p className="text-sm text-gray-600">Travel Package</p>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(data.packagePrice)}</p>
              </div>

              <Separator />

              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Service Fee</p>
                <p className="text-gray-900">{formatCurrency(data.serviceFee)}</p>
              </div>

              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax (VAT)</p>
                <p className="text-gray-900">{formatCurrency(data.tax)}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg print:bg-gray-100">
            <p className="text-lg font-bold text-gray-900">TOTAL PAID</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.total)}</p>
          </div>

          {/* Status Badge */}
          <div className="mt-6 text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              ✓ Payment {data.status}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p className="mb-2">Thank you for booking with OneDettyDecember!</p>
            <p>For questions, contact us at hello@onedettydecember.com</p>
            <p className="mt-4 text-xs">
              This is an official receipt for your payment. Please keep it for your records.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-none {
            background: none !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
        }
      `}</style>
    </div>
  );
}

