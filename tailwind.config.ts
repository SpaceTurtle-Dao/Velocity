import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

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
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / 100%)",
				input: "hsl(var(--input) / 100%)",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background) / 100%)",
				foreground: "hsl(var(--foreground) / 100%)",
				primary: {
					DEFAULT: "hsl(var(--primary) / 100%)",
					foreground: "hsl(var(--primary-foreground) / 100%)",
				},
        customColor: {
          light: 'hsl(var(--custom-color-light) / <alpha-value>)',
          DEFAULT: 'hsl(var(--custom-color) / <alpha-value>)',
          dark: 'hsl(var(--custom-color-dark) / <alpha-value>)',
        },
				secondary: {
					DEFAULT: "hsl(var(--secondary) / 100%)",
					foreground: "hsl(var(--secondary-foreground) / 100%)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / 100%)",
					foreground: "hsl(var(--destructive-foreground) / 100%)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / 100%)",
					foreground: "hsl(var(--muted-foreground) / 100%)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / 100%)",
					foreground: "hsl(var(--accent-foreground) / 100%)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / 100%)",
					foreground: "hsl(var(--popover-foreground) / 100%)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / 100%)",
					foreground: "hsl(var(--card-foreground) / 100%)",
				},
			},
			fontFamily: {
				sans: ["geist-sans", ...fontFamily.sans],
			},
		},
	},
  plugins: [require("tailwindcss-animate")],
};

export default config;
