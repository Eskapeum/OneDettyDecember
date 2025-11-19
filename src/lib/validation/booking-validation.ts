import type { BookingFormData } from '@/components/package/booking-form'

export interface ValidationErrors {
  checkIn?: string
  checkOut?: string
  dates?: string
  guests?: string
  specialRequests?: string
}

export interface ValidationOptions {
  minGuests?: number
  maxGuests?: number
  minNights?: number
  maxNights?: number
  maxSpecialRequestsLength?: number
  allowPastDates?: boolean
}

/**
 * Validates booking form data
 * @param data - Form data to validate
 * @param options - Validation options
 * @returns Validation errors object (empty if no errors)
 */
export function validateBookingForm(
  data: BookingFormData,
  options: ValidationOptions = {}
): ValidationErrors {
  const {
    minGuests = 1,
    maxGuests = 10,
    minNights = 1,
    maxNights = 30,
    maxSpecialRequestsLength = 500,
    allowPastDates = false,
  } = options

  const errors: ValidationErrors = {}

  // Validate check-in date
  if (!data.checkIn) {
    errors.checkIn = 'Check-in date is required'
  } else {
    const checkInDate = new Date(data.checkIn)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!allowPastDates && checkInDate < today) {
      errors.checkIn = 'Check-in date cannot be in the past'
    }
  }

  // Validate check-out date
  if (!data.checkOut) {
    errors.checkOut = 'Check-out date is required'
  } else if (data.checkIn) {
    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)

    if (checkOutDate <= checkInDate) {
      errors.checkOut = 'Check-out must be after check-in'
    }

    // Validate minimum nights
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (nights < minNights) {
      errors.dates = `Minimum stay is ${minNights} ${minNights === 1 ? 'night' : 'nights'}`
    }

    if (nights > maxNights) {
      errors.dates = `Maximum stay is ${maxNights} ${maxNights === 1 ? 'night' : 'nights'}`
    }
  }

  // Validate guests
  if (!data.guests || data.guests < 1) {
    errors.guests = 'Number of guests is required'
  } else {
    if (data.guests < minGuests) {
      errors.guests = `Minimum ${minGuests} ${minGuests === 1 ? 'guest' : 'guests'} required`
    }

    if (data.guests > maxGuests) {
      errors.guests = `Maximum ${maxGuests} ${maxGuests === 1 ? 'guest' : 'guests'} allowed`
    }
  }

  // Validate special requests
  if (data.specialRequests && data.specialRequests.length > maxSpecialRequestsLength) {
    errors.specialRequests = `Special requests must be less than ${maxSpecialRequestsLength} characters`
  }

  // Check for inappropriate content (basic check)
  if (data.specialRequests) {
    const inappropriatePatterns = [
      /\b(http|https):\/\//i, // URLs
      /\b\d{10,}\b/, // Long numbers (possible phone/card numbers)
    ]

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(data.specialRequests)) {
        errors.specialRequests = 'Special requests contain inappropriate content. Please remove URLs or contact information.'
        break
      }
    }
  }

  return errors
}

/**
 * Checks if form has any validation errors
 * @param errors - Validation errors object
 * @returns true if there are errors, false otherwise
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}

/**
 * Calculates number of nights between check-in and check-out
 * @param checkIn - Check-in date string
 * @param checkOut - Check-out date string
 * @returns Number of nights
 */
export function calculateNights(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 0

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  if (checkOutDate <= checkInDate) return 0

  return Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  )
}

/**
 * Formats a date to YYYY-MM-DD
 * @param date - Date object or string
 * @returns Formatted date string
 */
export function formatDateToISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Gets minimum selectable date (today or later)
 * @returns ISO date string
 */
export function getMinDate(): string {
  return formatDateToISO(new Date())
}

/**
 * Gets maximum selectable date (1 year from now)
 * @returns ISO date string
 */
export function getMaxDate(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return formatDateToISO(date)
}

/**
 * Validates single field
 * @param field - Field name
 * @param value - Field value
 * @param options - Validation options
 * @returns Error message or undefined
 */
export function validateField(
  field: keyof BookingFormData,
  value: any,
  allData: BookingFormData,
  options: ValidationOptions = {}
): string | undefined {
  const errors = validateBookingForm({ ...allData, [field]: value }, options)
  return errors[field] || errors.dates
}
