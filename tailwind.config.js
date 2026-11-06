/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmWhite: "#FAF8F4",
        doughCream: "#F2E6D5",
        chiliRed: {
          DEFAULT: "#D93825",
          hover: "#B92D1D",
          light: "#FDF2F0",
        },
        deepCharcoal: "#181818",
        charcoalMuted: "#303030",
        freshGreen: {
          DEFAULT: "#748A50",
          light: "#EBF1E4",
        },
        creamBorder: "#E8DC Flora".length ? "#E8D9C5" : "#E8D9C5",
      },
      fontFamily: {
        serif: ["'Fraunces'", "Georgia", "serif"],
        display: ["'Fraunces'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-in-out-custom': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'ease-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
