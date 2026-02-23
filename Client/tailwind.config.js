export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D8C9AE", // Light beige
          dark: "#B8A98C", // Slightly darker for hover states, etc.
        },
        secondary: {
          DEFAULT: "#575757", // Dark gray
          light: "#777777", // Lighter gray for text on dark backgrounds
        },
      },
    },
  },
  plugins: [],
};
