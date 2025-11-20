/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gradient: {
          start: '#667eea',
          end: '#764ba2'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-message-own': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'gradient-typing': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce-soft 1s infinite',
        'pulse-gentle': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'fade-scale': 'fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fadeInUp': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0) scale(1)'
          },
        },
        'slideInRight': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        'slideInLeft': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'message': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'input': '0 2px 15px rgba(59, 130, 246, 0.1)',
        'button': '0 8px 25px rgba(59, 130, 246, 0.3)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}