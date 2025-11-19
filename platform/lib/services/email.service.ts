import { Resend } from 'resend';
import { BookingConfirmationTemplate } from '@/lib/templates/booking-confirmation';

interface BookingEmailData {
  bookingId: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  packageTitle: string;
  packageType: string;
  location: string;
  startDate: string;
  endDate?: string;
  guestCount: number;
  totalAmount: number;
  currency: string;
  vendorName: string;
  vendorEmail: string;
  specialRequests?: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private resend: Resend;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendBookingConfirmation(data: BookingEmailData): Promise<EmailResult> {
    try {
      const emailHtml = BookingConfirmationTemplate(data);
      
      const result = await this.resend.emails.send({
        from: 'OneDettyDecember <bookings@onedettydecember.com>',
        to: [data.customerEmail],
        subject: `Booking Confirmed - ${data.confirmationCode} | OneDettyDecember`,
        html: emailHtml,
        text: this.generatePlainTextConfirmation(data),
      });

      if (result.error) {
        console.error('Resend email error:', result.error);
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendBookingCancellation(data: BookingEmailData & { cancellationReason?: string }): Promise<EmailResult> {
    try {
      const emailHtml = this.generateCancellationEmail(data);
      
      const result = await this.resend.emails.send({
        from: 'OneDettyDecember <bookings@onedettydecember.com>',
        to: [data.customerEmail],
        subject: `Booking Cancelled - ${data.confirmationCode} | OneDettyDecember`,
        html: emailHtml,
        text: this.generatePlainTextCancellation(data),
      });

      if (result.error) {
        console.error('Resend email error:', result.error);
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generatePlainTextConfirmation(data: BookingEmailData): string {
    return `
BOOKING CONFIRMED - OneDettyDecember

Confirmation Code: ${data.confirmationCode}

Dear ${data.customerName},

Your booking has been confirmed! Here are the details:

Experience: ${data.packageTitle}
Type: ${data.packageType}
Location: ${data.location}
Date: ${new Date(data.startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}
${data.endDate ? `End Date: ${new Date(data.endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}` : ''}
Guests: ${data.guestCount}
Total Paid: ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(data.totalAmount)}

${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}

Experience Provider: ${data.vendorName}
Contact: ${data.vendorEmail}

What's Next:
- Save your confirmation code: ${data.confirmationCode}
- Arrive 15 minutes before the scheduled time
- Bring a valid ID and your confirmation code
- Contact the provider if you have any questions

Thank you for choosing OneDettyDecember!

Visit https://onedettydecember.com/bookings/confirmation/${data.bookingId} to view full details.

---
OneDettyDecember
Lagos, Nigeria
support@onedettydecember.com
    `.trim();
  }

  private generatePlainTextCancellation(data: BookingEmailData & { cancellationReason?: string }): string {
    return `
BOOKING CANCELLED - OneDettyDecember

Confirmation Code: ${data.confirmationCode}

Dear ${data.customerName},

Your booking has been cancelled.

Experience: ${data.packageTitle}
Date: ${new Date(data.startDate).toLocaleDateString()}
Refund Amount: ${new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
    }).format(data.totalAmount)}

${data.cancellationReason ? `Reason: ${data.cancellationReason}` : ''}

Your refund will be processed within 5-7 business days to your original payment method.

If you have any questions, please contact us at support@onedettydecember.com.

Thank you for your understanding.

---
OneDettyDecember
Lagos, Nigeria
support@onedettydecember.com
    `.trim();
  }

  private generateCancellationEmail(data: BookingEmailData & { cancellationReason?: string }): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancelled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your booking has been successfully cancelled</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Cancelled Booking</p>
            <div style="background: #f3f4f6; border: 2px dashed #ef4444; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <strong style="font-family: monospace; font-size: 20px; color: #ef4444;">${data.confirmationCode}</strong>
            </div>
        </div>
        
        <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Cancelled Experience</h3>
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Experience:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right;">${data.packageTitle}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                <td style="padding: 8px 0; font-weight: 600; text-align: right;">${new Date(data.startDate).toLocaleDateString()}</td>
            </tr>
            <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 15px 0 8px 0; color: #6b7280; font-weight: bold;">Refund Amount:</td>
                <td style="padding: 15px 0 8px 0; font-weight: bold; text-align: right; color: #059669; font-size: 18px;">
                    ${new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.totalAmount)}
                </td>
            </tr>
        </table>
        
        ${data.cancellationReason ? `
        <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Cancellation Reason</h3>
        <p style="background: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">${data.cancellationReason}</p>
        ` : ''}
        
        <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Refund Information</h3>
        <ul style="padding-left: 20px; color: #6b7280;">
            <li>Your refund will be processed within 5-7 business days</li>
            <li>The refund will be credited to your original payment method</li>
            <li>You'll receive a separate email confirmation once the refund is processed</li>
        </ul>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://onedettydecember.com/packages" style="background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: 600; margin: 0 10px;">Find Another Experience</a>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p><strong>OneDettyDecember</strong><br>
        We're sorry to see you go. We hope to serve you again soon!</p>
    </div>
</body>
</html>`;
  }
}

export const emailService = new EmailService();
export default EmailService;
