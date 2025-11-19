/**
 * Booking Form Component
 * Handles booking creation with validation
 * Sprint 3 - Booking Flow
 * Developer: Neriah (Frontend Lead)
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Loader2 } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { GuestSelector } from './GuestSelector';

interface BookingFormProps {
  package: {
    id: string;
    title: string;
    price: number;
    currency: string;
    availableSlots: number | null;
    startDate: Date;
    endDate: Date;
  };
}

export function BookingForm({ package: pkg }: BookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalGuests = guests.adults + guests.children + guests.infants;
  const totalPrice = pkg.price * guests.adults;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          bookingDate: selectedDate.toISOString(),
          quantity: guests.adults,
          guestDetails: guests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to confirmation page
      router.push(`/bookings/${data.data.id}/confirmation`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-8 border rounded-lg shadow-lg p-6 bg-white">
      {/* Price Header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            {formatPrice(pkg.price, pkg.currency)}
          </span>
          <span className="text-gray-600">per person</span>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <DatePicker
          packageId={pkg.id}
          startDate={pkg.startDate}
          endDate={pkg.endDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* Guest Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Guests
        </label>
        <GuestSelector
          guests={guests}
          onChange={setGuests}
          maxGuests={pkg.availableSlots || 50}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatPrice(pkg.price, pkg.currency)} × {guests.adults} adults
          </span>
          <span className="font-medium">
            {formatPrice(totalPrice, pkg.currency)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service fee</span>
          <span className="font-medium">
            {formatPrice(totalPrice * 0.1, pkg.currency)}
          </span>
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice * 1.1, pkg.currency)}</span>
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={loading || !selectedDate}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Reserve'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        You won't be charged yet
      </p>
    </div>
  );
}

