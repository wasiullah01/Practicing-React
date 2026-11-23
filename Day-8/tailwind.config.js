/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20251f",
        paper: "#f8f7f4",
        forest: "#315b43",
        moss: "#e9eee7",
        clay: "#b46e4c",
      },
      fontFamily: {
        sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(32, 37, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
