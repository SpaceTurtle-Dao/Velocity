import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
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
				display: 'Overpass, ui-sans-serif',
				heading: 'Encode Sans, ui-serif',
			},
			colors: {
				border: "hsl(240, 3.7%, 15.9%)",
				input: "hsl(240, 3.7%, 15.9%)",
				ring: "hsl(240, 4.9%, 83.9%)",
				background: "hsl(240, 10%, 3.9%)",
				foreground: "hsl(0, 0%, 98%)",
				primary: {
					DEFAULT: "hsl(0, 0%, 98%)",
					foreground: "hsl(240, 5.9%, 10%)",
				},
				secondary: {
					DEFAULT: "hsl(240, 3.7%, 15.9%)",
					foreground: "hsl(0, 0%, 98%)",
				},
				destructive: {
					DEFAULT: "hsl(194, 97%, 45%)",
					foreground: "hsl(0, 0%, 98%)",
				},
				muted: {
					DEFAULT: "hsl(240, 3.7%, 15.9%)",
					foreground: "hsl(325, 80%, 56%)",
				},
				accent: {
					DEFAULT: "hsl(240, 3.7%, 15.9%)",
					foreground: "hsl(0, 0%, 98%)",
				},
				popover: {
					DEFAULT: "hsl(240, 10%, 3.9%)",
					foreground: "hsl(0, 0%, 98%)",
				},
				card: {
					DEFAULT: "hsl(240, 10%, 3.9%)",
					foreground: "hsl(0, 0%, 98%)",
				},
				"call": {
					50: "#E1FAFE",
					100: "#C3F5FE",
					200: "#88EBFC",
					300: "#4CE0FB",
					400: "#10D6F9",
					500: "#05AAC6",
					600: "#04889F",
					700: "#036677",
					800: "#024450",
					900: "#012228",
					950: "#001114"
				},
				"put": {
					50: "#FEEDEC",
					100: "#FCDBD9",
					200: "#F9B6B3",
					300: "#F7928D",
					400: "#F46E67",
					500: "#F1493F",
					600: "#E41B11",
					700: "#AB140C",
					800: "#720E08",
					900: "#390704",
					950: "#1D0302"
				}
			},
			borderRadius: {
				lg: "0.5rem",
				md: "calc(0.5rem - 2px)",
				sm: "calc(0.5rem - 4px)",
			},
		}
	},
};

export default config;
