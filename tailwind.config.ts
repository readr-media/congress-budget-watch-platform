import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#3E51FF",
          accent: "#E9808E",
        },
        success: {
          DEFAULT: "#2E982E",
        },
        warning: {
          DEFAULT: "#E9808E",
        },
        surface: {
          base: "#F6F6F6",
          subtle: "#F5F5F5",
          notice: "#E9E9E9",
          banner: "#DDDDDD",
        },
      neutral: {
        900: "#1C1C1C",
        500: "#868686",
        400: "#C7C7C7",
        350: "#959595",
        250: "#B9B9B9",
        200: "#C1C1C1",
      },
        info: {
          accent: "#37C6FF",
        },
        rose: {
          soft: "#FDE2E5",
        },
      },
      maxWidth: {
        banner: "600px",
        "visualization-card": "488px",
        "visualization-body": "800px",
      },
      borderWidth: {
        3: "3px",
        12: "12px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 15s linear infinite",
      },
    },
  },
} satisfies Config;
