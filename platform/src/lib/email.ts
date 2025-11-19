// Mock implementation for email service
// This will be replaced with actual implementation

export const emailService = {
  sendBookingConfirmation: async (bookingData: any) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Sending booking confirmation email to:', bookingData.guestInfo?.email)
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    }
  },
  
  sendBookingCancellation: async (bookingData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Sending booking cancellation email to:', bookingData.guestInfo?.email)
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    }
  },
  
  sendBookingReminder: async (bookingData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('Sending booking reminder email to:', bookingData.guestInfo?.email)
    
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    }
  },
}

export default emailService
