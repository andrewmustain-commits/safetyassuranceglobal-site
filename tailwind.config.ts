import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sag: {
          navy: "#09121f",
          corporate: "#1e3a5f",
          action: "#2563eb",
          glow: "#3b82f6",
          gold: "#f59e0b",
          amber: "#b45309",
          surface: "#1e293b",
          slate: "#0f172a",
          muted: "#94a3b8",
          light: "#f8fafc"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(59,130,246,.18)",
        gold: "0 0 36px rgba(245,158,11,.16)"
      },
      backgroundImage: {
        "grid-dark": "linear-gradient(rgba(148,163,184,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.06) 1px,transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
