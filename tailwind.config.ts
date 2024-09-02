import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";


const pallet = {
	"green": {
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
	"red": {
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
	},
	"background": {
		50: "#E8EBED",
		100: "#D5D9DD",
		200: "#A8B0B8",
		300: "#7E8A96",
		400: "#57616B",
		500: "#343A40",
		600: "#292E33",
		700: "#202427",
		800: "#151719",
		900: "#0B0D0E",
		950: "#050506"
	},
	'blue-bell': {
		50: '#FAFAFC', 100: '#DFE0EF', 200: '#C4C6E2', 300: '#A9ACD5', 400: '#8C8FC0', 500: '#7A7DA8', 600: '#686B8F', 700: '#575977', 800: '#45475F', 900: '#333547', 950: '#22232E',
	},
	'pastel-green': {
		50: '#F6FDF6', 100: '#CBF6C9', 200: '#9FEE9B', 300: '#73E66E', 400: '#4CD546', 500: '#42BA3D', 600: '#399F35', 700: '#2F842C', 800: '#266923', 900: '#1C4E1A', 950: '#123411',
	},
	'milano-red': {
		50: '#FDF4F2', 100: '#F4BBB3', 200: '#EB8374', 300: '#E14A35', 400: '#CF1C02', 500: '#B51802', 600: '#9B1501', 700: '#811101', 800: '#660E01', 900: '#4C0A01', 950: '#320700',
	},
	'screamin-green': {
		50: '#F6FFF6', 100: '#C7FECA', 200: '#99FC9E', 300: '#6AFB72', 400: '#42EE4B', 500: '#39D042', 600: '#31B238', 700: '#29942F', 800: '#207625', 900: '#18581C', 950: '#103912'
	},
	'aqua-pearl': {
		50: '#F9FBFD', 100: '#D8E8F5', 200: '#B8D5ED', 300: '#97C1E5', 400: '#77A9D3', 500: '#6894B8', 600: '#597E9E', 700: '#4A6983', 800: '#3B5468', 900: '#2C3E4E', 950: '#1D2933'
	},
	'bleached-cedar': {
		50: '#F5F4F5', 100: '#C0BDC4', 200: '#8C8593', 300: '#584E62', 400: '#2C2038', 500: '#261C31', 600: '#21182A', 700: '#1B1423', 800: '#16101C', 900: '#100C15', 950: '#0B080E'
	},
}

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
				// primary: pallet,
				// secondary: pallet.swappy_rose,
				// border: pallet.swappy_stone,
				// input: "hsl(var(--input) / <alpha-value>)",
				// ring: "hsl(var(--ring) / <alpha-value>)",
				// background: pallet.firefly,
				// foreground: pallet.swappy_teal,
				// primary: pallet["screamin-green"],
				// secondary: pallet["blue-bell"],

				border: "hsl(240, 3.7%, 15.9%)",
				input: "hsl(240, 3.7%, 15.9%)",
				ring: "hsl(240, 4.9%, 83.9%)",
				// background: pallet.background,
				foreground: "hsl(0, 0%, 98%)",

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
