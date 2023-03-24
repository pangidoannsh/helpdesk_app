/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "500": "#0093DD",
          "600": "#0072BE",
          "700": "#00559F",
          "800": "#003C80",
          "900": "#002B6A",
        },
        secondary: "#EE9D2B",
        ternary: "#6DB8DA",
      },
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}