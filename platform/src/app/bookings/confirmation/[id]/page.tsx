'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Download, Calendar, MapPin, Users, Mail, Phone } from 'lucide-react';

interface BookingConfirmation {
  id: string;
  confirmationCode: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  bookingDate: string;
  guestCount: number;
  specialRequests?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  package: {
    id: string;
    title: string;
    type: string;
    location: string;
    startDate: string;
    endDate?: string;
    images: string[];
    vendor: {
      name: string;
      email: string;
      phone?: string;
    };
  };
  payment: {
    id: string;
    method: string;
    status: string;
    paidAt: string;
  };
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookingConfirmation();
  }, [bookingId]);

  const fetchBookingConfirmation = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/confirmation`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking confirmation');
      }
      const data = await response.json();
      setBooking(data.booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/receipt`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-receipt-${booking?.confirmationCode}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download receipt:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-green-900 mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-green-700 mb-4">
                Your Detty December experience is all set. A confirmation email has been sent to {booking.customer.email}.
              </p>
              <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                <p className="text-2xl font-mono font-bold text-green-600">
                  {booking.confirmationCode}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Experience Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {booking.package.images.length > 0 && (
                <img
                  src={booking.package.images[0]}
                  alt={booking.package.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h3 className="font-semibold text-lg">{booking.package.title}</h3>
                <Badge variant="secondary" className="mt-1">
                  {booking.package.type}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.package.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(booking.package.startDate)}</span>
                </div>
                
                {booking.package.endDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Ends: {formatDate(booking.package.endDate)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Experience Cost</span>
                    <span>{formatCurrency(booking.totalAmount, booking.currency)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid</span>
                    <span className="text-green-600">
                      {formatCurrency(booking.totalAmount, booking.currency)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p>Payment Method: {booking.payment.method}</p>
                    <p>Paid on: {formatDate(booking.payment.paidAt)}</p>
                    <Badge variant="outline" className="mt-2">
                      {booking.payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Your Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>{booking.customer.firstName} {booking.customer.lastName}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{booking.customer.email}</span>
                      </div>
                      {booking.customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{booking.customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Experience Provider</h4>
                    <div className="space-y-1 text-sm">
                      <p>{booking.package.vendor.name}</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{booking.package.vendor.email}</span>
                      </div>
                      {booking.package.vendor.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{booking.package.vendor.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                  <Link href="/bookings">My Bookings</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/packages">Book More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
