// OneDettyDecember Animation Library
// Smooth, purposeful animations for better UX

export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',

  // Slide animations
  slideInFromTop: 'animate-in slide-in-from-top duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left duration-300',
  slideInFromRight: 'animate-in slide-in-from-right duration-300',

  // Scale animations
  scaleIn: 'animate-in zoom-in duration-200',
  scaleOut: 'animate-out zoom-out duration-150',

  // Hover effects
  hoverLift: 'transition-transform hover:-translate-y-1 duration-200',
  hoverScale: 'transition-transform hover:scale-105 duration-200',

  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
}

export const transitions = {
  fast: 'transition-all duration-150 ease-in-out',
  base: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
}
