/**
 * Package Detail Page
 * Displays package information and booking form
 * Sprint 3 - Booking Flow
 * Developer: Neriah (Frontend Lead)
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PackageDetail } from '@/components/packages/PackageDetail';

interface PackagePageProps {
  params: {
    id: string;
  };
}

async function getPackage(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/packages/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch package:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const pkg = await getPackage(params.id);

  if (!pkg) {
    return {
      title: 'Package Not Found',
    };
  }

  return {
    title: `${pkg.title} | OneDettyDecember`,
    description: pkg.description.substring(0, 160),
    openGraph: {
      title: pkg.title,
      description: pkg.description.substring(0, 160),
      images: pkg.images.slice(0, 1),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pkg.title,
      description: pkg.description.substring(0, 160),
      images: pkg.images.slice(0, 1),
    },
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const pkg = await getPackage(params.id);

  if (!pkg) {
    notFound();
  }

  return <PackageDetail package={pkg} />;
}

