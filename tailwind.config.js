/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Geist", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        "neo-black": "#0b0d14",
        "neo-charcoal": "#111827",
        "neo-purple": "#7c3aed",
        "neo-blue": "#38bdf8",
        "neo-pink": "#f472b6",
      },
      boxShadow: {
        glow: "0 0 25px rgba(124, 58, 237, 0.35)",
        "glow-blue": "0 0 25px rgba(56, 189, 248, 0.35)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(124,58,237,0.35), rgba(11,13,20,0.9))",
      },
    },
  },
  plugins: [],
};
