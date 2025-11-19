import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { pdfGenerator } from '@/lib/utils/pdf-generator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get comprehensive booking data
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users (
          firstName,
          lastName,
          email,
          phone
        ),
        package:packages (
          title,
          type,
          location,
          startDate,
          endDate,
          vendor:vendors (
            name,
            email,
            phone
          )
        ),
        payment:payments (
          method,
          paidAt,
          status
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Booking not found:', error);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Prepare PDF data
    const pdfData = {
      bookingId: booking.id,
      confirmationCode: booking.confirmationCode,
      customerName: `${booking.customer.firstName} ${booking.customer.lastName}`,
      customerEmail: booking.customer.email,
      customerPhone: booking.customer.phone,
      packageTitle: booking.package.title,
      packageType: booking.package.type,
      location: booking.package.location,
      startDate: booking.package.startDate,
      endDate: booking.package.endDate,
      guestCount: booking.guestCount || 1,
      totalAmount: booking.totalAmount,
      currency: booking.currency || 'USD',
      vendorName: booking.package.vendor.name,
      vendorEmail: booking.package.vendor.email,
      vendorPhone: booking.package.vendor.phone,
      specialRequests: booking.specialRequests,
      paymentMethod: booking.payment.method,
      paidAt: booking.payment.paidAt,
      status: booking.status,
    };

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generateBookingReceipt(pdfData);

    // Set response headers for PDF download
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="booking-receipt-${booking.confirmationCode}.pdf"`);
    headers.set('Content-Length', pdfBuffer.length.toString());

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('PDF generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt' },
      { status: 500 }
    );
  }
}
