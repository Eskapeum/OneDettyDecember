/**
 * Guest Selector Component
 * Allows users to select number of guests
 * Sprint 3 - Booking Flow
 * Developer: Tobi (Frontend)
 */

'use client';

import { useState } from 'react';
import { Users, Plus, Minus, ChevronDown } from 'lucide-react';

interface GuestSelectorProps {
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  onChange: (guests: { adults: number; children: number; infants: number }) => void;
  maxGuests?: number;
}

export function GuestSelector({ guests, onChange, maxGuests = 50 }: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const totalGuests = guests.adults + guests.children + guests.infants;

  const updateGuests = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newValue = guests[type] + delta;
    
    // Validation
    if (newValue < 0) return;
    if (type === 'adults' && newValue < 1) return; // At least 1 adult required
    if (totalGuests + delta > maxGuests) return;

    onChange({
      ...guests,
      [type]: newValue,
    });
  };

  const getGuestSummary = () => {
    const parts = [];
    if (guests.adults > 0) parts.push(`${guests.adults} adult${guests.adults > 1 ? 's' : ''}`);
    if (guests.children > 0) parts.push(`${guests.children} child${guests.children > 1 ? 'ren' : ''}`);
    if (guests.infants > 0) parts.push(`${guests.infants} infant${guests.infants > 1 ? 's' : ''}`);
    return parts.join(', ') || '0 guests';
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border rounded-lg hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span>{getGuestSummary()}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg p-4 space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Adults</p>
                <p className="text-sm text-gray-600">Age 13+</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateGuests('adults', -1)}
                  disabled={guests.adults <= 1}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{guests.adults}</span>
                <button
                  onClick={() => updateGuests('adults', 1)}
                  disabled={totalGuests >= maxGuests}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Children</p>
                <p className="text-sm text-gray-600">Age 2-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateGuests('children', -1)}
                  disabled={guests.children <= 0}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{guests.children}</span>
                <button
                  onClick={() => updateGuests('children', 1)}
                  disabled={totalGuests >= maxGuests}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Infants</p>
                <p className="text-sm text-gray-600">Under 2</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateGuests('infants', -1)}
                  disabled={guests.infants <= 0}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{guests.infants}</span>
                <button
                  onClick={() => updateGuests('infants', 1)}
                  disabled={totalGuests >= maxGuests}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Max Guests Warning */}
            {totalGuests >= maxGuests && (
              <p className="text-sm text-amber-600 text-center">
                Maximum {maxGuests} guests allowed
              </p>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}

