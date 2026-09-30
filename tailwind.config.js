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
        /* Fleroma / Enpees Brand Colors: warm linen palette from hero video */
        paper: { DEFAULT: '#F0E8D8', deep: '#EDE3CF', line: '#D9C9AE' },
        cocoa: { DEFAULT: '#3D2B1F', deep: '#2E1F14', soft: '#5C3E28' },
        charcoal: {
          DEFAULT: '#3D2B1F',
          mid: '#5C3E28',
          light: '#7D5E38',
        },
        gold: {
          DEFAULT: '#9A7854',
          light: '#B8956A',
          dark: '#7D5E38',
        },
        ivory: {
          DEFAULT: '#F0E8D8',
          muted: '#EDE3CF',
        },
        linen: { DEFAULT: '#F0E8D8' },
        parchment: { DEFAULT: '#EDE3CF' },
        warmSand: { DEFAULT: '#E2D5BE' },
        walnut: { DEFAULT: '#3D2B1F', mid: '#5C3E28', gold: '#9A7854' },
        /* Enpees espresso identity (landing page) */
        espresso: {
          900: '#F0E8D8',
          800: '#EDE3CF',
          700: '#D9C9AE',
        },
        cream: {
          100: '#3D2B1F',
          card: '#E8DCC8',
        },
        taupe: { 400: '#9A7854' },
        goldm: { 500: '#9A7854', 600: '#7D5E38' },
        ivory50: '#F5EDE0',
        ink: { 900: '#3D2B1F' },
        wick: { 900: '#9A7854' },
      },
      fontFamily: {
        /* Marcellus display (heritage serif) + Outfit UI (geometric sans). */
        playfair: ['Marcellus', 'Georgia', 'serif'],
        display:  ['Marcellus', 'Georgia', 'serif'],
        marcellus: ['Marcellus', 'Georgia', 'serif'],
        jost:     ['Outfit', 'system-ui', 'sans-serif'],
        inter:    ['Outfit', 'system-ui', 'sans-serif'],
        poppins:  ['Outfit', 'system-ui', 'sans-serif'],
        sans:     ['Outfit', 'system-ui', 'sans-serif'],
        body:     ['Outfit', 'system-ui', 'sans-serif'],
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