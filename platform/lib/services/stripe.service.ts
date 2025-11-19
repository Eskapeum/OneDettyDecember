import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

interface PaymentIntentData {
  amount: number;
  currency: string;
  bookingId: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  description: string;
  metadata?: Record<string, string>;
}

interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  clientSecret?: string;
  error?: string;
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  error?: string;
}

class StripeService {
  private stripe: Stripe;
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    });

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // Create payment intent for booking
  async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      // Create or retrieve customer
      let customerId = data.customerId;
      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: data.customerEmail,
          name: data.customerName,
          metadata: {
            bookingId: data.bookingId,
          },
        });
        customerId = customer.id;
      }

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        customer: customerId,
        description: data.description,
        metadata: {
          bookingId: data.bookingId,
          customerEmail: data.customerEmail,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        setup_future_usage: 'off_session', // For future payments
      });

      // Store payment record in database
      await this.supabase.from('payments').insert({
        id: paymentIntent.id,
        bookingId: data.bookingId,
        provider: 'stripe',
        amount: data.amount,
        currency: data.currency,
        status: 'PENDING',
        customerId,
        metadata: {
          stripeCustomerId: customerId,
          ...data.metadata,
        },
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment intent creation failed',
      };
    }
  }

  // Confirm payment intent
  async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update payment record
        await this.supabase
          .from('payments')
          .update({
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
            metadata: {
              ...paymentIntent.metadata,
              stripePaymentMethod: paymentIntent.payment_method,
            },
          })
          .eq('id', paymentIntentId);

        return {
          success: true,
          paymentIntentId: paymentIntent.id,
        };
      } else {
        return {
          success: false,
          error: `Payment not completed. Status: ${paymentIntent.status}`,
        };
      }
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed',
      };
    }
  }

  // Create refund
  async createRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<RefundResult> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        reason: reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer',
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      // Update payment record
      await this.supabase
        .from('payments')
        .update({
          status: 'REFUNDED',
          refundedAt: new Date().toISOString(),
          refundAmount: refund.amount / 100, // Convert back to dollars
          refundId: refund.id,
        })
        .eq('id', paymentIntentId);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
      };
    } catch (error) {
      console.error('Stripe refund creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund creation failed',
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['customer', 'payment_method'],
      });

      return {
        success: true,
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          customer: paymentIntent.customer,
          paymentMethod: paymentIntent.payment_method,
          metadata: paymentIntent.metadata,
          created: new Date(paymentIntent.created * 1000),
        },
      };
    } catch (error) {
      console.error('Failed to get payment details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get payment details',
      };
    }
  }

  // Handle webhook events
  async handleWebhook(payload: string, signature: string): Promise<{
    success: boolean;
    event?: Stripe.Event;
    error?: string;
  }> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
      }

      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }

      return {
        success: true,
        event,
      };
    } catch (error) {
      console.error('Stripe webhook handling failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook handling failed',
      };
    }
  }

  // Handle successful payment
  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingId = paymentIntent.metadata.bookingId;
      
      if (bookingId) {
        // Update booking status
        await this.supabase
          .from('bookings')
          .update({
            status: 'CONFIRMED',
            paidAt: new Date().toISOString(),
          })
          .eq('id', bookingId);

        // Update payment status
        await this.supabase
          .from('payments')
          .update({
            status: 'COMPLETED',
            completedAt: new Date().toISOString(),
          })
          .eq('id', paymentIntent.id);

        console.log(`Payment succeeded for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Failed to handle payment success:', error);
    }
  }

  // Handle failed payment
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingId = paymentIntent.metadata.bookingId;
      
      if (bookingId) {
        // Update booking status
        await this.supabase
          .from('bookings')
          .update({
            status: 'PAYMENT_FAILED',
          })
          .eq('id', bookingId);

        // Update payment status
        await this.supabase
          .from('payments')
          .update({
            status: 'FAILED',
            failedAt: new Date().toISOString(),
          })
          .eq('id', paymentIntent.id);

        console.log(`Payment failed for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
    }
  }

  // Handle charge dispute
  private async handleChargeDispute(dispute: Stripe.Dispute) {
    try {
      console.log(`Charge dispute created: ${dispute.id}`);
      
      // Log dispute for manual review
      await this.supabase.from('payment_disputes').insert({
        id: dispute.id,
        chargeId: dispute.charge,
        amount: dispute.amount / 100,
        reason: dispute.reason,
        status: dispute.status,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to handle charge dispute:', error);
    }
  }
}

export const stripeService = new StripeService();
export default StripeService;
