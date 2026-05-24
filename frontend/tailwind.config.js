/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#60a5fa",
        surface: "#f8fafc",
        ink: "#0f172a",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626"
      },
      boxShadow: {
        panel: "0 20px 45px rgba(37, 99, 235, 0.12)"
      }
    }
  },
  plugins: []
};
