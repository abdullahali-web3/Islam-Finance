/** @type {import('tailwindcss').Config} */
// Semantic color tokens mirror components/theme.ts. Dark values are applied via the
// `dark:` variant (media-based, so they follow the OS appearance = userInterfaceStyle "automatic").
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Raw palette (matches palette in components/theme.ts)
        green: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#1B5E20',
          600: '#144D17',
          700: '#0D3B10',
        },
        gold: {
          100: '#FBE9C6',
          500: '#C9971F',
          600: '#A97D14',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#F7F7F5',
          100: '#EDEDEA',
          300: '#C7C7C2',
          500: '#8A8A85',
          700: '#4A4A46',
          900: '#1C1C1A',
        },
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
    },
  },
  plugins: [],
};
