/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        subtleAccent: 'var(--subtle-accent)',
        modalOverlay: 'var(--modal-overlay)',
        recipeCardHeader: 'var(--recipe-card-header)',
        green: {
          100: "#d6f2e4",
          200: "#ace5c8",
          300: "#83d8ad",
          400: "#59cb91",
          500: "#30be76",
          600: "#26985e",
          700: "#1d7247",
          800: "#134c2f",
          900: "#0a2618"
        },
        mainColor2: {
          100: "#fef0db",
          200: "#fce1b6",
          300: "#fbd292",
          400: "#f9c36d",
          500: "#f8b449",
          600: "#c6903a",
          700: "#956c2c",
          800: "#63481d",
          900: "#32240f"
        },
        charcoal: {
          100: "#d7d7d7",
          200: "#afafaf",
          300: "#868887",
          400: "#5e605f",
          500: "#363837",
          600: "#2b2d2c",
          700: "#202221",
          800: "#161616",
          900: "#0b0b0b"
        },
        black2: {
          100: "#e4e4e4",
          200: "#c8c8c8",
          300: "#adadad",
          400: "#919191",
          500: "#767676",
          600: "#5e5e5e",
          700: "#474747",
          800: "#2f2f2f",
          900: "#181818"
        },
        brownGrey: {
          100: "#eeeeee",
          200: "#dcdcdc",
          300: "#cbcbcb",
          400: "#b9b9b9",
          500: "#a8a8a8",
          600: "#868686",
          700: "#656565",
          800: "#434343",
          900: "#222222"
        },
        gray1: {
          100: "#f5f5f5",
          200: "#ebebeb",
          300: "#e0e0e0",
          400: "#d6d6d6",
          500: "#cccccc",
          600: "#a3a3a3",
          700: "#7a7a7a",
          800: "#525252",
          900: "#292929"
        },
        gray2: {
          100: "#fafafa",
          200: "#f5f5f5",
          300: "#f0f0f0",
          400: "#ebebeb",
          500: "#e6e6e6",
          600: "#b8b8b8",
          700: "#8a8a8a",
          800: "#5c5c5c",
          900: "#2e2e2e"
        },
        red: {
          100: "#fedbe3",
          200: "#fcb6c6",
          300: "#fb92aa",
          400: "#f96d8d",
          500: "#f84971",
          600: "#c63a5a",
          700: "#952c44",
          800: "#631d2d",
          900: "#320f17"
        },
        lightBg: {
          100: "#fdfefe",
          200: "#fcfcfd",
          300: "#fafbfc",
          400: "#f9f9fb",
          500: "#f7f8fa",
          600: "#c6c6c8",
          700: "#949596",
          800: "#636364",
          900: "#313232"
        },
        brownishGrey: {
          100: "#eeeeee",
          200: "#dcdcdc",
          300: "#cbcbcb",
          400: "#b9b9b9",
          500: "#a8a8a8",
          600: "#868686",
          700: "#656565",
          800: "#434343",
          900: "#222222"
        },
        black: {
          100: "#cdcfce",
          200: "#9a9f9d",
          300: "#686f6b",
          400: "#353f3a",
          500: "#030f09",
          600: "#020c07",
          700: "#020905",
          800: "#010604",
          900: "#010302"

        },
        white: {
          100: "#ffffff",
          200: "#ffffff",
          300: "#ffffff",
          400: "#ffffff",
          500: "#ffffff",
          600: "#cccccc",
          700: "#999999",
          800: "#666666",
          900: "#333333"
        },
      },
      spacing: {
        12: '3.188rem',
        5: '1.313rem',
      },
      fontSize: {
        custom: '1rem',
      },
      lineHeight: {
        custom: '1.31',
      },
    },
  },
  plugins: [],
};



