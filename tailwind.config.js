/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#0A2540", // Azul Oxford
          secondary: "#D9E8F5", // Celeste Suave
          background: "#FFFFFF", // Blanco Puro
          text: "#4A4A4A", // Gris Grafito
          accent: "#C9A227", // Dorado Suave
        },
      },
    },
    plugins: [],
  }