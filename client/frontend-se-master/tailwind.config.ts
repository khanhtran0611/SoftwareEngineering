import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#E6F7F6',
        foreground: '#14213D',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#14213D'
        },
        popover: {
          DEFAULT: '#F0FAFA',
          foreground: '#14213D'
        },
        primary: {
          DEFAULT: '#00B8A9',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#F9A826',
          foreground: '#14213D'
        },
        accent: {
          DEFAULT: '#FFD56B',
          foreground: '#14213D'
        },
        muted: {
          DEFAULT: '#D1E8E2',
          foreground: '#4B5563'
        },
        destructive: {
          DEFAULT: '#EF476F',
          foreground: '#ffffff'
        },
        info: {
          DEFAULT: '#118AB2',
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#06D6A0',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#F4A261',
          foreground: '#14213D'
        },
        border: '#C7DAD4',
        input: '#C7DAD4',
        ring: '#00B8A9',
        chart: {
          '1': '#00B8A9',
          '2': '#F9A826',
          '3': '#06D6A0',
          '4': '#EF476F',
          '5': '#118AB2'
        },
        sidebar: {
          DEFAULT: '#D1E8E2',
          foreground: '#14213D',
          primary: '#00B8A9',
          'primary-foreground': '#ffffff',
          accent: '#FFD56B',
          'accent-foreground': '#14213D',
          border: '#C7DAD4',
          ring: '#118AB2'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animate],
};

export default config;
