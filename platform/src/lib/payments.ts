// Mock implementation for payment processor
// This will be replaced with actual implementation

export const paymentProcessor = {
  processPayment: async (paymentData: any) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock different payment scenarios
    if (paymentData.cardNumber === '4000000000000002') {
      return {
        success: false,
        error: 'Card declined',
        code: 'CARD_DECLINED',
      }
    }
    
    if (paymentData.cardNumber === '4000000000000119') {
      return {
        success: false,
        error: 'Insufficient funds',
        code: 'INSUFFICIENT_FUNDS',
      }
    }
    
    return {
      success: true,
      transactionId: `txn_${Date.now()}`,
      paymentId: `pay_${Date.now()}`,
    }
  },
  
  refundPayment: async (paymentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      refundId: `ref_${Date.now()}`,
    }
  },
}

export default paymentProcessor
