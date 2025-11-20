import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripeService } from '@/lib/services/stripe.service';
import { logger } from '@/lib/logger';

/**
 * Stripe Webhook Handler
 * 
 * Handles incoming webhook events from Stripe for payment processing.
 * Events handled:
 * - payment_intent.succeeded
 * - payment_intent.failed
 * - payment_intent.canceled
 * - charge.dispute.created
 * - charge.dispute.updated
 * - charge.refunded
 */

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    
    // Get the Stripe signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      logger.error('Stripe webhook: Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify and process the webhook
    const result = await stripeService.handleWebhook(body, signature);

    if (!result.success) {
      logger.error('Stripe webhook processing failed', { error: result.error });
      return NextResponse.json(
        { error: result.error || 'Webhook processing failed' },
        { status: 400 }
      );
    }

    // Log successful webhook processing
    logger.info('Stripe webhook processed successfully', {
      eventId: result.event?.id,
      eventType: result.event?.type,
    });

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({
      received: true,
      eventId: result.event?.id,
      eventType: result.event?.type,
    });

  } catch (error: any) {
    logger.error('Stripe webhook error', {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

