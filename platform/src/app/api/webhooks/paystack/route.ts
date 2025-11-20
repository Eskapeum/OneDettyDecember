import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { paystackService } from '@/lib/services/paystack.service';
import { logger } from '@/lib/logger';

/**
 * Paystack Webhook Handler
 * 
 * Handles incoming webhook events from Paystack for payment processing.
 * Events handled:
 * - charge.success
 * - charge.failed
 * - transfer.success
 * - transfer.failed
 */

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    
    // Get the Paystack signature from headers
    const headersList = await headers();
    const signature = headersList.get('x-paystack-signature');

    if (!signature) {
      logger.error('Paystack webhook: Missing x-paystack-signature header');
      return NextResponse.json(
        { error: 'Missing x-paystack-signature header' },
        { status: 400 }
      );
    }

    // Parse the body
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (parseError) {
      logger.error('Paystack webhook: Invalid JSON payload');
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Verify and process the webhook
    const result = await paystackService.handleWebhook(payload, signature);

    if (!result.success) {
      logger.error('Paystack webhook processing failed', { error: result.error });
      return NextResponse.json(
        { error: result.error || 'Webhook processing failed' },
        { status: 400 }
      );
    }

    // Log successful webhook processing
    logger.info('Paystack webhook processed successfully', {
      event: result.event?.event,
      reference: result.event?.data?.reference,
    });

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({
      received: true,
      event: result.event?.event,
      reference: result.event?.data?.reference,
    });

  } catch (error: any) {
    logger.error('Paystack webhook error', {
      error: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { error: 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}

// Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

