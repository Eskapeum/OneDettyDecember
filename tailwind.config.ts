import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OneDettyDecember Vertical Themes
        stays: {
          DEFAULT: '#2A9D8F',
          light: '#48C9B0',
          dark: '#1C6B61',
        },
        events: {
          DEFAULT: '#E63946',
          light: '#F94D5A',
          dark: '#BE2A35',
        },
        experiences: {
          DEFAULT: '#FB8500',
          light: '#FFA033',
          dark: '#C66900',
        },
        cars: {
          DEFAULT: '#003566',
          light: '#004A8D',
          dark: '#002344',
        },
        marketplace: {
          DEFAULT: '#7209B7',
          light: '#9933D1',
          dark: '#560691',
        },
        community: {
          DEFAULT: '#FFD60A',
          light: '#FFE13D',
          dark: '#CCB000',
        },
      },
    },
  },
  plugins: [],
}
export default config
