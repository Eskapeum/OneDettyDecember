/**
 * Package Detail Component
 * Displays complete package information
 * Sprint 3 - Booking Flow
 * Developer: Neriah (Frontend Lead)
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users, Star, Heart } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { BookingForm } from '../booking/BookingForm';

interface PackageDetailProps {
  package: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    city: string;
    images: string[];
    capacity: number;
    availableSlots: number | null;
    startDate: Date;
    endDate: Date;
    type: string;
    vendor: {
      id: string;
      firstName: string;
      lastName: string;
    };
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: Date;
      users: {
        firstName: string;
        lastName: string;
      };
    }>;
  };
}

export function PackageDetail({ package: pkg }: PackageDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Image Gallery */}
      <ImageGallery images={pkg.images} title={pkg.title} />

      {/* Package Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {pkg.type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {pkg.city}, {pkg.location}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {pkg.title}
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{pkg.averageRating.toFixed(1)}</span>
                  <span className="text-gray-600">({pkg.totalReviews} reviews)</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Hosted by {pkg.vendor.firstName} {pkg.vendor.lastName}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">About this experience</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-medium">
                    {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-medium">
                    {pkg.availableSlots !== null
                      ? `${pkg.availableSlots} spots available`
                      : 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">
              Reviews ({pkg.totalReviews})
            </h2>
            <div className="space-y-4">
              {pkg.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {review.users.firstName} {review.users.lastName}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <BookingForm package={pkg} />
        </div>
      </div>
    </div>
  );
}

