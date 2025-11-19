import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripeService } from '@/lib/services/stripe.service';
import { paystackService } from '@/lib/services/paystack.service';
import { emailService } from '@/lib/services/email.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, provider, bookingId } = body;

    if (!paymentId || !provider || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentId, provider, bookingId' },
        { status: 400 }
      );
    }

    // Validate provider
    if (!['stripe', 'paystack'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid payment provider. Must be "stripe" or "paystack"' },
        { status: 400 }
      );
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        totalAmount,
        currency,
        guestCount,
        specialRequests,
        customer:users (
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
          vendor:vendors (
            name,
            email,
            phone
          )
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify payment based on provider
    let paymentVerified = false;
    let paymentDetails: any = null;

    if (provider === 'stripe') {
      const stripeResult = await stripeService.confirmPaymentIntent(paymentId);
      paymentVerified = stripeResult.success;
      if (stripeResult.success) {
        const detailsResult = await stripeService.getPaymentDetails(paymentId);
        paymentDetails = detailsResult.payment;
      }
    } else if (provider === 'paystack') {
      const paystackResult = await paystackService.verifyPayment(paymentId);
      paymentVerified = paystackResult.success && paystackResult.status === 'success';
      if (paymentVerified) {
        const detailsResult = await paystackService.getTransactionDetails(paymentId);
        paymentDetails = detailsResult.transaction;
      }
    }

    if (!paymentVerified) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Generate confirmation code
    const confirmationCode = `ODD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'CONFIRMED',
        confirmationCode,
        confirmedAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    // Create confirmation record
    await supabase.from('booking_confirmations').insert({
      bookingId,
      confirmationCode,
      confirmedAt: new Date().toISOString(),
      emailSent: false,
      pdfGenerated: false,
    });

    // Send confirmation email
    try {
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
        vendorName: booking.package.vendor.name,
        vendorEmail: booking.package.vendor.email,
        specialRequests: booking.specialRequests,
      };

      const emailResult = await emailService.sendBookingConfirmation(emailData);
      
      if (emailResult.success) {
        // Update confirmation record
        await supabase
          .from('booking_confirmations')
          .update({
            emailSent: true,
            emailSentAt: new Date().toISOString(),
          })
          .eq('bookingId', bookingId);
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      confirmationCode,
      booking: {
        id: booking.id,
        status: 'CONFIRMED',
        confirmationCode,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        package: {
          title: booking.package.title,
          location: booking.package.location,
          startDate: booking.package.startDate,
        },
        customer: {
          name: `${booking.customer.firstName} ${booking.customer.lastName}`,
          email: booking.customer.email,
        },
      },
      payment: {
        id: paymentId,
        provider,
        amount: paymentDetails?.amount || booking.totalAmount,
        currency: paymentDetails?.currency || booking.currency,
        status: 'completed',
        paidAt: new Date().toISOString(),
      },
      message: 'Payment confirmed and booking completed successfully',
    });

  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('booking_id');
    const confirmationCode = searchParams.get('confirmation_code');

    if (!bookingId && !confirmationCode) {
      return NextResponse.json(
        { error: 'Either booking_id or confirmation_code is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('bookings')
      .select(`
        id,
        status,
        confirmationCode,
        totalAmount,
        currency,
        confirmedAt,
        paidAt,
        guestCount,
        specialRequests,
        customer:users (
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
          vendor:vendors (
            name,
            email,
            phone
          )
        ),
        payment:payments (
          id,
          provider,
          amount,
          currency,
          status,
          completedAt
        )
      `);

    if (bookingId) {
      query = query.eq('id', bookingId);
    } else {
      query = query.eq('confirmationCode', confirmationCode);
    }

    const { data: booking, error } = await query.single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        status: booking.status,
        confirmationCode: booking.confirmationCode,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        confirmedAt: booking.confirmedAt,
        paidAt: booking.paidAt,
        guestCount: booking.guestCount,
        specialRequests: booking.specialRequests,
        customer: {
          name: `${booking.customer.firstName} ${booking.customer.lastName}`,
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
          vendor: {
            name: booking.package.vendor.name,
            email: booking.package.vendor.email,
            phone: booking.package.vendor.phone,
          },
        },
        payment: booking.payment ? {
          id: booking.payment.id,
          provider: booking.payment.provider,
          amount: booking.payment.amount,
          currency: booking.payment.currency,
          status: booking.payment.status,
          completedAt: booking.payment.completedAt,
        } : null,
      },
    });

  } catch (error) {
    console.error('Failed to get booking confirmation:', error);
    return NextResponse.json(
      { error: 'Failed to get booking confirmation' },
      { status: 500 }
    );
  }
}
