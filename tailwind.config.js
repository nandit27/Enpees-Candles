/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Enpees Brand Colors */
        charcoal: {
          DEFAULT: '#0D0B0A',
          mid: '#1A1614',
          light: '#2A2420',
        },
        gold: {
          DEFAULT: '#C89B3C',
          light: '#E4B84A',
          dark: '#8B6A1F',
        },
        ivory: {
          DEFAULT: '#F5EFE6',
          muted: '#C4B89A',
        },
        burgundy: { DEFAULT: '#6B1F35' },
        emerald:  { DEFAULT: '#1A4A3A' },
        /* Enpees espresso identity (landing page) */
        espresso: {
          900: '#2A1D15',
          800: '#3B2A1E',
          700: '#4A3527',
        },
        cream: {
          100: '#EDE6D8',
          card: '#DAD3C4',
        },
        taupe: { 400: '#C7BCA8' },
        goldm: { 500: '#D3A34E', 600: '#C08F3A' },
        ivory50: '#F5F2EC',
        ink: { 900: '#1A1A1A' },
        /* bridges espresso-900 into the near-black footer */
        wick: { 900: '#150E09' },
      },
      fontFamily: {
        /* font-playfair kept as the alias the Footer already uses */
        playfair: ['Fraunces', 'Georgia', 'serif'],
        display:  ['Fraunces', 'Georgia', 'serif'],
        jost:     ['Jost', 'system-ui', 'sans-serif'],
        inter:    ['Inter', 'system-ui', 'sans-serif'],
        poppins:  ['Poppins', 'system-ui', 'sans-serif'],
        sans:     ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}