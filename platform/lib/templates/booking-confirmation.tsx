interface BookingConfirmationData {
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

export function BookingConfirmationTemplate(data: BookingConfirmationData): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - ${data.confirmationCode}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .confirmation-code { text-align: center; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 10px; }
        .confirmation-code h3 { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #8b5cf6; background: white; padding: 15px; border-radius: 8px; border: 2px dashed #8b5cf6; margin-bottom: 10px; }
        .section { margin-bottom: 30px; }
        .section h3 { color: #374151; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .detail-row:last-child { border-bottom: none; }
        .detail-row.total { font-weight: bold; font-size: 18px; color: #059669; border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 15px; }
        .label { color: #6b7280; font-weight: 500; }
        .value { color: #374151; font-weight: 600; }
        .next-steps ul { list-style: none; padding: 0; }
        .next-steps li { padding: 8px 0; padding-left: 25px; position: relative; }
        .next-steps li:before { content: "→"; position: absolute; left: 0; color: #8b5cf6; font-weight: bold; }
        .cta { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 24px; margin: 8px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #6b7280; font-size: 14px; margin: 5px 0; }
        @media only screen and (max-width: 600px) {
            .container { margin: 0; }
            .content { padding: 20px; }
            .detail-row { flex-direction: column; gap: 5px; }
            .value { text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your Detty December experience is all set</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Confirmation Code -->
            <div class="confirmation-code">
                <h3>Confirmation Code</h3>
                <div class="code">${data.confirmationCode}</div>
                <p style="font-size: 12px; color: #6b7280;">Save this code for your records</p>
            </div>

            <!-- Booking Details -->
            <div class="section">
                <h3>Your Booking Details</h3>
                <div class="detail-row">
                    <span class="label">Experience:</span>
                    <span class="value">${data.packageTitle}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Type:</span>
                    <span class="value">${data.packageType}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Location:</span>
                    <span class="value">${data.location}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Date & Time:</span>
                    <span class="value">${formatDate(data.startDate)}</span>
                </div>
                ${data.endDate ? `
                <div class="detail-row">
                    <span class="label">End Date:</span>
                    <span class="value">${formatDate(data.endDate)}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Guests:</span>
                    <span class="value">${data.guestCount}</span>
                </div>
                ${data.specialRequests ? `
                <div class="detail-row">
                    <span class="label">Special Requests:</span>
                    <span class="value">${data.specialRequests}</span>
                </div>
                ` : ''}
                <div class="detail-row total">
                    <span class="label">Total Paid:</span>
                    <span class="value">${formatCurrency(data.totalAmount, data.currency)}</span>
                </div>
            </div>

            <!-- Contact Info -->
            <div class="section">
                <h3>Contact Information</h3>
                <div class="detail-row">
                    <span class="label">Customer:</span>
                    <span class="value">${data.customerName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${data.customerEmail}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Experience Provider:</span>
                    <span class="value">${data.vendorName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Provider Contact:</span>
                    <span class="value">${data.vendorEmail}</span>
                </div>
            </div>

            <!-- Next Steps -->
            <div class="section next-steps">
                <h3>What's Next?</h3>
                <ul>
                    <li>Save your confirmation code: <strong>${data.confirmationCode}</strong></li>
                    <li>Check your email for any updates from the experience provider</li>
                    <li>Arrive at the location 15 minutes before the scheduled time</li>
                    <li>Bring a valid ID and your confirmation code</li>
                    <li>Contact the provider directly for any specific questions</li>
                </ul>
            </div>

            <!-- CTA Buttons -->
            <div class="cta">
                <a href="https://onedettydecember.com/bookings/confirmation/${data.bookingId}" class="btn">
                    View Booking Details
                </a>
                <a href="https://onedettydecember.com/bookings" class="btn" style="background: #f3f4f6; color: #374151;">
                    Manage Bookings
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>OneDettyDecember</strong></p>
            <p>Lagos, Nigeria</p>
            <p>
                <a href="https://onedettydecember.com" style="color: #8b5cf6;">Visit Website</a> | 
                <a href="mailto:support@onedettydecember.com" style="color: #8b5cf6;">Contact Support</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent to ${data.customerEmail}. If you have any questions, please contact our support team.
            </p>
        </div>
    </div>
</body>
</html>`;
}
