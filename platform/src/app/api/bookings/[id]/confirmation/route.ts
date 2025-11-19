import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/services/email.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get comprehensive booking data
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users (
          id,
          firstName,
          lastName,
          email,
          phone
        ),
        package:packages (
          id,
          title,
          type,
          location,
          startDate,
          endDate,
          images,
          vendor:vendors (
            id,
            name,
            email,
            phone
          )
        ),
        payment:payments (
          id,
          method,
          status,
          paidAt,
          amount,
          currency
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Booking not found:', error);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedBooking = {
      id: booking.id,
      confirmationCode: booking.confirmationCode,
      status: booking.status,
      totalAmount: booking.totalAmount,
      currency: booking.currency || 'USD',
      bookingDate: booking.createdAt,
      guestCount: booking.guestCount || 1,
      specialRequests: booking.specialRequests,
      customer: {
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },
      package: {
        id: booking.package.id,
        title: booking.package.title,
        type: booking.package.type,
        location: booking.package.location,
        startDate: booking.package.startDate,
        endDate: booking.package.endDate,
        images: booking.package.images || [],
        vendor: {
          name: booking.package.vendor.name,
          email: booking.package.vendor.email,
          phone: booking.package.vendor.phone,
        },
      },
      payment: {
        id: booking.payment.id,
        method: booking.payment.method,
        status: booking.payment.status,
        paidAt: booking.payment.paidAt,
      },
    };

    return NextResponse.json({
      success: true,
      booking: formattedBooking,
    });

  } catch (error) {
    console.error('Failed to get booking confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to get booking confirmation' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Generate confirmation code if not exists
    const confirmationCode = `ODD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Update booking with confirmation
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        confirmationCode,
        status: 'CONFIRMED',
        confirmedAt: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    // Get updated booking data for email
    const { data: booking } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users (firstName, lastName, email),
        package:packages (title, type, location, startDate, endDate),
        vendor:vendors (name, email)
      `)
      .eq('id', bookingId)
      .single();

    if (booking) {
      // Send confirmation email
      const emailData = {
        bookingId: booking.id,
        confirmationCode,
        customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        customerEmail: booking.customer.email,
        packageTitle: booking.package.title,
        packageType: booking.package.type,
        location: booking.package.location,
        startDate: booking.package.startDate,
        endDate: booking.package.endDate,
        guestCount: booking.guestCount || 1,
        totalAmount: booking.totalAmount,
        currency: booking.currency || 'USD',
        vendorName: booking.vendor.name,
        vendorEmail: booking.vendor.email,
        specialRequests: booking.specialRequests,
      };

      const emailResult = await emailService.sendBookingConfirmation(emailData);
      
      if (!emailResult.success) {
        console.error('Failed to send confirmation email:', emailResult.error);
      }
    }

    return NextResponse.json({
      success: true,
      confirmationCode,
      message: 'Booking confirmed successfully',
    });

  } catch (error) {
    console.error('Booking confirmation failed:', error);
    return NextResponse.json(
      { error: 'Booking confirmation failed' },
      { status: 500 }
    );
  }
}
