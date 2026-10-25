import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { leaf: { 50: "#f3f9ed", 100: "#e3f0d7", 500: "#5b9c35", 600: "#477f29", 700: "#356522" } }, boxShadow: { soft: "0 8px 30px rgba(30, 64, 20, .08)" } } },
  plugins: []
};
export default config;
