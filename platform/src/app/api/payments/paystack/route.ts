import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { paystackService } from '@/lib/services/paystack.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, currency = 'NGN', customerEmail, customerName, customerPhone } = body;

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

    // Convert amount to appropriate currency if needed
    let paymentAmount = amount;
    if (currency === 'NGN' && amount < 1000) {
      // Assume amount is in USD, convert to NGN (approximate rate)
      paymentAmount = amount * 1500; // This should use real exchange rates in production
    }

    // Validate amount matches booking (with some tolerance for currency conversion)
    const tolerance = currency === 'NGN' ? 1000 : 1; // 1000 NGN or 1 USD tolerance
    if (Math.abs(paymentAmount - booking.totalAmount) > tolerance) {
      return NextResponse.json(
        { error: 'Payment amount does not match booking amount' },
        { status: 400 }
      );
    }

    // Initialize payment
    const paymentResult = await paystackService.initializePayment({
      amount: paymentAmount,
      currency,
      bookingId,
      customerEmail,
      customerName,
      customerPhone,
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
      reference: paymentResult.reference,
      authorizationUrl: paymentResult.authorizationUrl,
      accessCode: paymentResult.accessCode,
      amount: paymentAmount,
      currency,
    });

  } catch (error) {
    console.error('Paystack payment initialization failed:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const action = searchParams.get('action');

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'verify':
        // Verify payment
        const verificationResult = await paystackService.verifyPayment(reference);

        if (!verificationResult.success) {
          return NextResponse.json(
            { error: verificationResult.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          verification: verificationResult,
        });

      case 'details':
        // Get transaction details
        const detailsResult = await paystackService.getTransactionDetails(reference);

        if (!detailsResult.success) {
          return NextResponse.json(
            { error: detailsResult.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          transaction: detailsResult.transaction,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "verify" or "details"' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Paystack payment operation failed:', error);
    return NextResponse.json(
      { error: 'Payment operation failed' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, action, amount, reason } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'refund':
        const refundResult = await paystackService.createRefund(reference, amount, reason);
        
        if (!refundResult.success) {
          return NextResponse.json(
            { error: refundResult.error },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Refund initiated successfully',
          refundId: refundResult.refundId,
          amount: refundResult.amount,
        });

      case 'cancel':
        // Cancel payment (update status in database)
        await supabase
          .from('payments')
          .update({
            status: 'CANCELLED',
            cancelledAt: new Date().toISOString(),
          })
          .eq('reference', reference);

        return NextResponse.json({
          success: true,
          message: 'Payment cancelled successfully',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "refund" or "cancel"' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Paystack payment action failed:', error);
    return NextResponse.json(
      { error: 'Payment action failed' },
      { status: 500 }
    );
  }
}
