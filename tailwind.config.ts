import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";


const pallet = {
  "background": {
    50: "#E7ECE4",
    100: "#D1DCCC",
    200: "#A0B696",
    300: "#739164",
    400: "#485A3F",
    500: "#1F271B",
    600: "#181E15",
    700: "#131811",
    800: "#0C0F0A",
    900: "#070906",
    950: "#020302"
  },
  "jet": {
    50: "#EAEBEA",
    100: "#D2D5D2",
    200: "#A8AEA8",
    300: "#7B847B",
    400: "#515751",
    500: "#282B28",
    600: "#202220",
    700: "#191A19",
    800: "#111211",
    900: "#070807",
    950: "#050505"
  },
  "blackOlive": {
    50: "#E9ECEA",
    100: "#D6DCD7",
    200: "#ACB9B0",
    300: "#809386",
    400: "#5B6C60",
    500: "#38423B",
    600: "#2C342F",
    700: "#212723",
    800: "#171C19",
    900: "#0C0E0C",
    950: "#050605"
  },
  "green": {
    50: "#EBFFF5",
    100: "#D2FEE8",
    200: "#A4FED1",
    300: "#77FDBA",
    400: "#4FFDA6",
    500: "#20FC8F",
    600: "#03E273",
    700: "#02A654",
    800: "#026F38",
    900: "#01371C",
    950: "#001E0F"
  },
  "red": {
    50: "#FDE7EC",
    100: "#FBD5DC",
    200: "#F8A6B6",
    300: "#F47B93",
    400: "#F15171",
    500: "#ED254E",
    600: "#CB1136",
    700: "#970C28",
    800: "#63081A",
    900: "#34040E",
    950: "#180206"
  },
}

const config: Config = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,svelte,ts}"
  ],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'Encode Sans', ...fontFamily.sans],
        body: ['var(--font-body)', 'Overpass', ...fontFamily.sans],
        display: ['Overpass', 'ui-sans-serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
