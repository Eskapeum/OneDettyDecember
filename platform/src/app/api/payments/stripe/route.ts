import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripeService } from '@/lib/services/stripe.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, currency = 'USD', customerEmail, customerName } = body;

    // Validate required fields
    if (!bookingId || !amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount, customerEmail, customerName' },
        { status: 400 }
      );
    }

    // Validate booking exists and is not already paid
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        totalAmount,
        package:packages (
          id,
          title,
          type
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

    if (booking.status === 'CONFIRMED' || booking.status === 'PAID') {
      return NextResponse.json(
        { error: 'Booking is already paid' },
        { status: 400 }
      );
    }

    // Validate amount matches booking
    if (Math.abs(amount - booking.totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Payment amount does not match booking amount' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentResult = await stripeService.createPaymentIntent({
      amount,
      currency,
      bookingId,
      customerEmail,
      customerName,
      description: `OneDettyDecember - ${booking.package.title}`,
      metadata: {
        bookingId,
        packageId: booking.package.id,
        packageTitle: booking.package.title,
        packageType: booking.package.type,
      },
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentResult.paymentIntentId,
      clientSecret: paymentResult.clientSecret,
      amount,
      currency,
    });

  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    // Get payment details
    const paymentResult = await stripeService.getPaymentDetails(paymentIntentId);

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: paymentResult.payment,
    });

  } catch (error) {
    console.error('Failed to get payment details:', error);
    return NextResponse.json(
      { error: 'Failed to get payment details' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, action } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'confirm':
        const confirmResult = await stripeService.confirmPaymentIntent(paymentIntentId);
        
        if (!confirmResult.success) {
          return NextResponse.json(
            { error: confirmResult.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Payment confirmed successfully',
          paymentIntentId: confirmResult.paymentIntentId,
        });

      case 'cancel':
        // Cancel payment intent (if possible)
        try {
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          await stripe.paymentIntents.cancel(paymentIntentId);

          // Update payment status
          await supabase
            .from('payments')
            .update({
              status: 'CANCELLED',
              cancelledAt: new Date().toISOString(),
            })
            .eq('id', paymentIntentId);

          return NextResponse.json({
            success: true,
            message: 'Payment cancelled successfully',
          });
        } catch (error) {
          return NextResponse.json(
            { error: 'Failed to cancel payment' },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Payment action failed:', error);
    return NextResponse.json(
      { error: 'Payment action failed' },
      { status: 500 }
    );
  }
}
