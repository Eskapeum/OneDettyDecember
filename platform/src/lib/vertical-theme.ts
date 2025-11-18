import { colors } from './design-tokens'

export type Vertical = 'events' | 'stays' | 'experiences' | 'cars' | 'marketplace' | 'community'

export const getVerticalColor = (vertical: Vertical): string => {
  return colors.verticals[vertical]
}

export const getVerticalClasses = (vertical: Vertical) => {
  const colorMap = {
    events: 'bg-[#E63946] hover:bg-[#D62839] text-white',
    stays: 'bg-[#2A9D8F] hover:bg-[#238276] text-white',
    experiences: 'bg-[#FB8500] hover:bg-[#E07700] text-white',
    cars: 'bg-[#003566] hover:bg-[#002A52] text-white',
    marketplace: 'bg-[#7209B7] hover:bg-[#5F07A0] text-white',
    community: 'bg-[#FFD60A] hover:bg-[#E6C109] text-black',
  }

  return colorMap[vertical]
}

export const getVerticalBorderClasses = (vertical: Vertical) => {
  const borderMap = {
    events: 'border-[#E63946]',
    stays: 'border-[#2A9D8F]',
    experiences: 'border-[#FB8500]',
    cars: 'border-[#003566]',
    marketplace: 'border-[#7209B7]',
    community: 'border-[#FFD60A]',
  }

  return borderMap[vertical]
}
