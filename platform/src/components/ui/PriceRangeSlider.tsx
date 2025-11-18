// Mock implementation for PriceRangeSlider component
// This will be replaced with actual implementation

import React from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  return (
    <div data-testid="price-range-slider">
      <input
        data-testid="min-price"
        type="number"
        value={value[0]}
        onChange={(e) => onChange([parseInt(e.target.value), value[1]])}
      />
      <input
        data-testid="max-price"
        type="number"
        value={value[1]}
        onChange={(e) => onChange([value[0], parseInt(e.target.value)])}
      />
    </div>
  )
}

export default PriceRangeSlider
