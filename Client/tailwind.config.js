export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // blue-500
          dark: "#2563EB", // blue-600
          light: "#60A5FA", // blue-400
        },
        secondary: {
          DEFAULT: "#64748B", // slate-500
          dark: "#475569", // slate-600
          light: "#94A3B8", // slate-400
        },
        accent: {
          DEFAULT: "#10B981", // emerald-500
          dark: "#059669", // emerald-600
          light: "#34D399", // emerald-400
        },
        danger: {
          DEFAULT: "#EF4444", // red-500
          dark: "#DC2626", // red-600
        },
        success: {
          DEFAULT: "#22C55E", // green-500
          dark: "#16A34A", // green-600
        },
        warning: {
          DEFAULT: "#F59E0B", // amber-500
          dark: "#D97706", // amber-600
        },
      },
    },
  },
  plugins: [],
};
