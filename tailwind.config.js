/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10131A",
        mist: "#EAF0F8",
        ember: "#FF6B35",
        mint: "#00A878",
        slate: "#202633"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      boxShadow: {
        glow: "0 8px 30px rgba(255, 107, 53, 0.2)"
      }
    }
  },
  plugins: []
};
