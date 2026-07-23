/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0f1729",
          800: "#1a2138",
          700: "#232d47",
          600: "#2d3a56",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
    },
  },
  plugins: [],
};
