/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Light mode (default)
        background: {
          DEFAULT: '#f8fafc', // slate-50
          dark: '#020617', // slate-950
        },
        foreground: {
          DEFAULT: '#0f172a', // slate-900
          dark: '#f8fafc', // slate-50
        },
        card: {
          DEFAULT: '#ffffff', // white
          dark: '#0f172a', // slate-900
        },
        border: {
          DEFAULT: '#e2e8f0', // slate-200
          dark: '#1e293b', // slate-800
        },
        input: {
          DEFAULT: '#e2e8f0', // slate-200
          dark: '#1e293b', // slate-800
        },
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f1f5f9', // slate-100
          foreground: '#0f172a', // slate-900
          dark: '#334155', // slate-700
        },
        muted: {
          DEFAULT: '#f1f5f9', // slate-100
          foreground: '#64748b', // slate-500
          dark: '#334155', // slate-700
        },
        accent: {
          DEFAULT: '#f1f5f9', // slate-100
          foreground: '#0f172a', // slate-900
        },
        destructive: {
          DEFAULT: '#dc2626', // red-600
          foreground: '#ffffff',
        },
        // Direct color references for easier use
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      borderRadius: {
        lg: '0.75rem', // 12px
        md: '0.5rem', // 8px
        sm: '0.375rem', // 6px
      },
    },
  },
  plugins: [],
};
