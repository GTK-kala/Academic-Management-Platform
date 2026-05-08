/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // toggled by ThemeContext
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: "#796BD8",
          light: "#9A8FDF", // lighter tint for hover states
          dark: "#5A4CB8", // darker shade for active/pressed
          50: "#F4F2FC",
          100: "#E9E5F9",
          200: "#D3CBF3",
          300: "#BDB1ED",
          400: "#A797E7",
          500: "#796BD8",
          600: "#6A5BC7",
          700: "#5B4BB6",
          800: "#4C3CA5",
          900: "#3D2D94",
        },
        // Neutral white/gray for surfaces and text
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#121212",
        },
        // For dark mode backgrounds
        dark: {
          bg: "#1E1E2F",
          card: "#2A2A3C",
          border: "#3A3A4E",
        },
      },
      // Optional: adjust border radius, shadows, etc.
    },
  },
  plugins: [],
};
