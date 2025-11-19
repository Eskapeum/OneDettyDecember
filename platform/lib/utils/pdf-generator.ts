import puppeteer from 'puppeteer';

interface BookingReceiptData {
  bookingId: string;
  confirmationCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  vendorPhone?: string;
  specialRequests?: string;
  paymentMethod: string;
  paidAt: string;
  status: string;
}

class PDFGenerator {
  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  private generateReceiptHTML(data: BookingReceiptData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Receipt - ${data.confirmationCode}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #8b5cf6; }
        .company-info h1 { font-size: 24px; color: #8b5cf6; margin-bottom: 5px; }
        .company-info p { font-size: 10px; color: #666; margin-bottom: 2px; }
        .document-info { text-align: right; }
        .document-info h2 { font-size: 18px; color: #333; margin-bottom: 10px; }
        .confirmation-code { font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #8b5cf6; background: #f8fafc; padding: 8px 12px; border: 1px dashed #8b5cf6; border-radius: 4px; margin-bottom: 5px; }
        .issue-date { font-size: 10px; color: #666; }
        .section { margin-bottom: 25px; page-break-inside: avoid; }
        .section h3 { font-size: 14px; color: #374151; margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid #e5e7eb; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { display: flex; justify-content: space-between; padding: 6px 0; }
        .label { font-weight: 600; color: #6b7280; flex: 1; }
        .value { color: #374151; text-align: right; flex: 1; }
        .experience-details { background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #8b5cf6; }
        .experience-title { font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 8px; }
        .type-badge { background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-right: 10px; }
        .location { color: #6b7280; font-size: 11px; }
        .payment-summary { background: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; }
        .payment-details { max-width: 300px; margin-left: auto; }
        .payment-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .payment-row.total { font-size: 14px; font-weight: bold; color: #059669; border-top: 1px solid #d1fae5; margin-top: 8px; padding-top: 8px; }
        .important-info { background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; }
        .important-info ul { list-style: none; padding-left: 0; }
        .important-info li { padding: 3px 0; padding-left: 15px; position: relative; }
        .important-info li:before { content: "•"; color: #f59e0b; font-weight: bold; position: absolute; left: 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
        .footer p { margin-bottom: 8px; color: #6b7280; font-size: 10px; }
        @media print { .container { padding: 0; } .section { page-break-inside: avoid; } }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <h1>OneDettyDecember</h1>
                <p>Lagos, Nigeria</p>
                <p>+234 (0) 123 456 7890 | support@onedettydecember.com</p>
                <p>https://onedettydecember.com</p>
            </div>
            <div class="document-info">
                <h2>BOOKING RECEIPT</h2>
                <div class="confirmation-code">${data.confirmationCode}</div>
                <p class="issue-date">Issued: ${this.formatDate(new Date().toISOString())}</p>
            </div>
        </div>

        <!-- Customer Information -->
        <div class="section">
            <h3>Customer Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">Name:</span>
                    <span class="value">${data.customerName}</span>
                </div>
                <div class="info-item">
                    <span class="label">Email:</span>
                    <span class="value">${data.customerEmail}</span>
                </div>
                ${data.customerPhone ? `
                <div class="info-item">
                    <span class="label">Phone:</span>
                    <span class="value">${data.customerPhone}</span>
                </div>
                ` : ''}
                <div class="info-item">
                    <span class="label">Booking Date:</span>
                    <span class="value">${this.formatDate(data.paidAt)}</span>
                </div>
            </div>
        </div>

        <!-- Experience Details -->
        <div class="section">
            <h3>Experience Details</h3>
            <div class="experience-details">
                <div class="experience-title">${data.packageTitle}</div>
                <div style="margin-bottom: 15px;">
                    <span class="type-badge">${data.packageType}</span>
                    <span class="location">📍 ${data.location}</span>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <span class="label">Start Date & Time:</span>
                        <span class="value">${this.formatDate(data.startDate)}</span>
                    </div>
                    ${data.endDate ? `
                    <div class="info-item">
                        <span class="label">End Date & Time:</span>
                        <span class="value">${this.formatDate(data.endDate)}</span>
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <span class="label">Number of Guests:</span>
                        <span class="value">${data.guestCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Status:</span>
                        <span class="value" style="color: #059669; font-weight: bold;">${data.status}</span>
                    </div>
                </div>

                ${data.specialRequests ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                    <h4 style="font-size: 12px; color: #374151; margin-bottom: 5px;">Special Requests:</h4>
                    <p style="color: #6b7280; font-style: italic;">${data.specialRequests}</p>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Vendor Information -->
        <div class="section">
            <h3>Experience Provider</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="label">Business Name:</span>
                    <span class="value">${data.vendorName}</span>
                </div>
                <div class="info-item">
                    <span class="label">Contact Email:</span>
                    <span class="value">${data.vendorEmail}</span>
                </div>
                ${data.vendorPhone ? `
                <div class="info-item">
                    <span class="label">Phone:</span>
                    <span class="value">${data.vendorPhone}</span>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Payment Summary -->
        <div class="section payment-summary">
            <h3>Payment Summary</h3>
            <div class="payment-details">
                <div class="payment-row">
                    <span class="label">Experience Cost:</span>
                    <span class="value">${this.formatCurrency(data.totalAmount, data.currency)}</span>
                </div>
                <div class="payment-row">
                    <span class="label">Payment Method:</span>
                    <span class="value">${data.paymentMethod}</span>
                </div>
                <div class="payment-row">
                    <span class="label">Payment Date:</span>
                    <span class="value">${this.formatDate(data.paidAt)}</span>
                </div>
                <div class="payment-row total">
                    <span class="label">Total Paid:</span>
                    <span class="value">${this.formatCurrency(data.totalAmount, data.currency)}</span>
                </div>
            </div>
        </div>

        <!-- Important Information -->
        <div class="section important-info">
            <h3>Important Information</h3>
            <ul>
                <li>Please arrive at the venue 15 minutes before the scheduled start time</li>
                <li>Bring a valid photo ID and this receipt</li>
                <li>Contact the experience provider directly for any specific questions</li>
                <li>Cancellation policy applies as per terms and conditions</li>
                <li>For support, contact us at support@onedettydecember.com</li>
            </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Thank you for choosing OneDettyDecember!</strong></p>
            <p>We hope you have an amazing Detty December experience.</p>
            <p style="margin-top: 15px;">
                https://onedettydecember.com | support@onedettydecember.com | +234 (0) 123 456 7890
            </p>
        </div>
    </div>
</body>
</html>`;
  }

  async generateBookingReceipt(data: BookingReceiptData): Promise<Buffer> {
    let browser;
    
    try {
      // Launch browser
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      
      // Set the HTML content
      const html = this.generateReceiptHTML(data);
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF receipt');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  // Alternative method using HTML-to-PDF service (for serverless environments)
  async generateBookingReceiptServerless(data: BookingReceiptData): Promise<Buffer> {
    try {
      // This would use a service like Puppeteer on Lambda, or HTML/CSS to PDF API
      const html = this.generateReceiptHTML(data);
      
      // For now, return the HTML as a buffer (in production, use actual PDF service)
      console.log('Generating PDF receipt for booking:', data.confirmationCode);
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Buffer.from(html, 'utf-8');
    } catch (error) {
      console.error('Serverless PDF generation failed:', error);
      throw new Error('Failed to generate PDF receipt');
    }
  }
}

export const pdfGenerator = new PDFGenerator();
export default PDFGenerator;
