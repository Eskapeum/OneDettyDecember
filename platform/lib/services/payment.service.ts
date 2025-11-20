/**
 * Payment Orchestration Service
 * 
 * Unified payment interface that coordinates between Stripe and Paystack.
 * Automatically selects the best payment provider based on currency and region.
 */

import { stripeService } from './stripe.service';
import { paystackService } from './paystack.service';
import { logger } from '@/lib/logger';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type PaymentProvider = 'stripe' | 'paystack';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';

export interface PaymentInitiationData {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  provider?: PaymentProvider; // Optional: auto-select if not provided
}

export interface PaymentResult {
  success: boolean;
  provider: PaymentProvider;
  paymentId?: string;
  clientSecret?: string;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export interface PaymentStatusResult {
  success: boolean;
  status: PaymentStatus;
  provider: PaymentProvider;
  paymentId: string;
  amount?: number;
  currency?: string;
  error?: string;
}

/**
 * Payment Orchestration Service
 */
export class PaymentService {
  /**
   * Select the best payment provider based on currency and region
   */
  selectProvider(currency: string, region?: string): PaymentProvider {
    // Paystack is best for African currencies
    const paystackCurrencies = ['NGN', 'GHS', 'ZAR', 'KES'];
    
    if (paystackCurrencies.includes(currency.toUpperCase())) {
      return 'paystack';
    }

    // Stripe for all other currencies (USD, EUR, GBP, etc.)
    return 'stripe';
  }

  /**
   * Initiate a payment with automatic provider selection
   */
  async initiatePayment(data: PaymentInitiationData): Promise<PaymentResult> {
    try {
      // Select provider if not specified
      const provider = data.provider || this.selectProvider(data.currency);

      logger.info('Initiating payment', {
        bookingId: data.bookingId,
        provider,
        currency: data.currency,
        amount: data.amount,
      });

      // Create payment record in database
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .insert({
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          provider,
          status: 'pending',
        })
        .select()
        .single();

      if (dbError) {
        logger.error('Failed to create payment record', { error: dbError });
        return {
          success: false,
          provider,
          error: 'Failed to create payment record',
        };
      }

      // Route to appropriate provider
      if (provider === 'stripe') {
        const result = await stripeService.createPaymentIntent({
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
        });

        return {
          success: result.success,
          provider: 'stripe',
          paymentId: result.paymentIntentId,
          clientSecret: result.clientSecret,
          error: result.error,
        };
      } else {
        const result = await paystackService.initializePayment({
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          email: data.customerEmail,
          metadata: {
            customerName: data.customerName,
            customerPhone: data.customerPhone,
          },
        });

        return {
          success: result.success,
          provider: 'paystack',
          reference: result.reference,
          authorizationUrl: result.authorizationUrl,
          error: result.error,
        };
      }
    } catch (error: any) {
      logger.error('Payment initiation error', {
        error: error.message,
        bookingId: data.bookingId,
      });

      return {
        success: false,
        provider: data.provider || 'stripe',
        error: error.message || 'Payment initiation failed',
      };
    }
  }

  /**
   * Process a payment (confirm/verify)
   */
  async processPayment(paymentId: string, provider: PaymentProvider): Promise<PaymentResult> {
    try {
      logger.info('Processing payment', { paymentId, provider });

      if (provider === 'stripe') {
        const result = await stripeService.confirmPaymentIntent(paymentId);
        return {
          success: result.success,
          provider: 'stripe',
          paymentId: result.paymentIntentId,
          error: result.error,
        };
      } else {
        const result = await paystackService.verifyPayment(paymentId);
        return {
          success: result.success,
          provider: 'paystack',
          reference: paymentId,
          error: result.error,
        };
      }
    } catch (error: any) {
      logger.error('Payment processing error', {
        error: error.message,
        paymentId,
        provider,
      });

      return {
        success: false,
        provider,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResult> {
    try {
      // Get payment from database
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (dbError || !payment) {
        return {
          success: false,
          status: 'failed',
          provider: 'stripe',
          paymentId,
          error: 'Payment not found',
        };
      }

      return {
        success: true,
        status: payment.status,
        provider: payment.provider,
        paymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
      };
    } catch (error: any) {
      logger.error('Get payment status error', {
        error: error.message,
        paymentId,
      });

      return {
        success: false,
        status: 'failed',
        provider: 'stripe',
        paymentId,
        error: error.message || 'Failed to get payment status',
      };
    }
  }

  /**
   * Retry a failed payment
   */
  async retryPayment(paymentId: string): Promise<PaymentResult> {
    try {
      // Get original payment
      const { data: payment, error: dbError } = await supabase
        .from('payments')
        .select('*, booking:bookings(*)')
        .eq('id', paymentId)
        .single();

      if (dbError || !payment) {
        return {
          success: false,
          provider: 'stripe',
          error: 'Payment not found',
        };
      }

      // Create new payment attempt
      return this.initiatePayment({
        bookingId: payment.bookingId,
        amount: payment.amount,
        currency: payment.currency,
        customerEmail: payment.booking.customerEmail,
        customerName: payment.booking.customerName,
        provider: payment.provider,
      });
    } catch (error: any) {
      logger.error('Payment retry error', {
        error: error.message,
        paymentId,
      });

      return {
        success: false,
        provider: 'stripe',
        error: error.message || 'Payment retry failed',
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
