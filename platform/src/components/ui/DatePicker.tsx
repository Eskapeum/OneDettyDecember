// Mock implementation for DatePicker component
// This will be replaced with actual implementation

import React from 'react'

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      data-testid="date-picker"
      type="date"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
    />
  )
}

export default DatePicker
