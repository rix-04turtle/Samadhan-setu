/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  "#fff8f0",
          100: "#ffecd1",
          400: "#ffb347",
          500: "#FF9933",
          600: "#e8851a",
          700: "#c96800",
        },
        "india-green": {
          500: "#138808",
          600: "#0f6e06",
          700: "#0a5404",
        },
      },
    },
  },
  plugins: [],
}