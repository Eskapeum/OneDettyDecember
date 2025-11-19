import { createClient } from '@supabase/supabase-js';

interface PaystackInitializeData {
  amount: number;
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  description: string;
  metadata?: Record<string, any>;
}

interface PaystackResult {
  success: boolean;
  reference?: string;
  authorizationUrl?: string;
  accessCode?: string;
  error?: string;
}

interface PaystackVerificationResult {
  success: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  paidAt?: string;
  channel?: string;
  error?: string;
}

interface PaystackRefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  error?: string;
}

class PaystackService {
  private baseUrl: string;
  private secretKey: string;
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.baseUrl = 'https://api.paystack.co';
    
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  // Initialize payment transaction
  async initializePayment(data: PaystackInitializeData): Promise<PaystackResult> {
    try {
      const reference = `ODD_${data.bookingId}_${Date.now()}`;
      
      const payload = {
        email: data.customerEmail,
        amount: Math.round(data.amount * 100), // Convert to kobo/cents
        currency: data.currency,
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/paystack/callback`,
        metadata: {
          bookingId: data.bookingId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          ...data.metadata,
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      };

      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Payment initialization failed');
      }

      // Store payment record in database
      await this.supabase.from('payments').insert({
        id: reference,
        bookingId: data.bookingId,
        provider: 'paystack',
        amount: data.amount,
        currency: data.currency,
        status: 'PENDING',
        reference,
        metadata: {
          paystackAccessCode: result.data.access_code,
          ...data.metadata,
        },
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        reference,
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
      };
    } catch (error) {
      console.error('Paystack payment initialization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initialization failed',
      };
    }
  }

  // Verify payment transaction
  async verifyPayment(reference: string): Promise<PaystackVerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Payment verification failed');
      }

      const transaction = result.data;
      
      // Update payment record
      await this.supabase
        .from('payments')
        .update({
          status: transaction.status === 'success' ? 'COMPLETED' : 'FAILED',
          completedAt: transaction.status === 'success' ? new Date().toISOString() : null,
          failedAt: transaction.status !== 'success' ? new Date().toISOString() : null,
          metadata: {
            paystackTransactionId: transaction.id,
            channel: transaction.channel,
            cardType: transaction.authorization?.card_type,
            bank: transaction.authorization?.bank,
            last4: transaction.authorization?.last4,
          },
        })
        .eq('reference', reference);

      return {
        success: true,
        status: transaction.status,
        amount: transaction.amount / 100, // Convert back from kobo/cents
        currency: transaction.currency,
        paidAt: transaction.paid_at,
        channel: transaction.channel,
      };
    } catch (error) {
      console.error('Paystack payment verification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed',
      };
    }
  }

  // Create refund
  async createRefund(reference: string, amount?: number, reason?: string): Promise<PaystackRefundResult> {
    try {
      const payload: any = {
        transaction: reference,
      };

      if (amount) {
        payload.amount = Math.round(amount * 100); // Convert to kobo/cents
      }

      if (reason) {
        payload.customer_note = reason;
      }

      const response = await fetch(`${this.baseUrl}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Refund creation failed');
      }

      // Update payment record
      await this.supabase
        .from('payments')
        .update({
          status: 'REFUNDED',
          refundedAt: new Date().toISOString(),
          refundAmount: result.data.amount / 100, // Convert back from kobo/cents
          refundId: result.data.id,
        })
        .eq('reference', reference);

      return {
        success: true,
        refundId: result.data.id,
        amount: result.data.amount / 100,
      };
    } catch (error) {
      console.error('Paystack refund creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund creation failed',
      };
    }
  }

  // Get transaction details
  async getTransactionDetails(reference: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(result.message || 'Failed to get transaction details');
      }

      return {
        success: true,
        transaction: {
          id: result.data.id,
          reference: result.data.reference,
          amount: result.data.amount / 100,
          currency: result.data.currency,
          status: result.data.status,
          channel: result.data.channel,
          paidAt: result.data.paid_at,
          customer: result.data.customer,
          authorization: result.data.authorization,
          metadata: result.data.metadata,
        },
      };
    } catch (error) {
      console.error('Failed to get transaction details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transaction details',
      };
    }
  }

  // Handle webhook events
  async handleWebhook(payload: any, signature: string): Promise<{
    success: boolean;
    event?: any;
    error?: string;
  }> {
    try {
      // Verify webhook signature
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET || '')
        .update(JSON.stringify(payload))
        .digest('hex');

      if (hash !== signature) {
        throw new Error('Invalid webhook signature');
      }

      const event = payload;

      // Handle different event types
      switch (event.event) {
        case 'charge.success':
          await this.handleChargeSuccess(event.data);
          break;
        case 'charge.failed':
          await this.handleChargeFailed(event.data);
          break;
        case 'refund.processed':
          await this.handleRefundProcessed(event.data);
          break;
        default:
          console.log(`Unhandled Paystack event type: ${event.event}`);
      }

      return {
        success: true,
        event,
      };
    } catch (error) {
      console.error('Paystack webhook handling failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Webhook handling failed',
      };
    }
  }

  // Handle successful charge
  private async handleChargeSuccess(data: any) {
    try {
      const bookingId = data.metadata?.bookingId;
      
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
          .eq('reference', data.reference);

        console.log(`Paystack payment succeeded for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Failed to handle charge success:', error);
    }
  }

  // Handle failed charge
  private async handleChargeFailed(data: any) {
    try {
      const bookingId = data.metadata?.bookingId;
      
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
          .eq('reference', data.reference);

        console.log(`Paystack payment failed for booking ${bookingId}`);
      }
    } catch (error) {
      console.error('Failed to handle charge failure:', error);
    }
  }

  // Handle processed refund
  private async handleRefundProcessed(data: any) {
    try {
      console.log(`Paystack refund processed: ${data.id}`);
      
      // Update payment record
      await this.supabase
        .from('payments')
        .update({
          status: 'REFUNDED',
          refundedAt: new Date().toISOString(),
        })
        .eq('reference', data.transaction_reference);
    } catch (error) {
      console.error('Failed to handle refund processed:', error);
    }
  }
}

export const paystackService = new PaystackService();
export default PaystackService;
