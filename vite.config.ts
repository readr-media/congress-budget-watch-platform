import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mkcert from "vite-plugin-mkcert";

const PROD_BASE = "/project/3/congress-budget-watch/";
const DEV_BASE = "/project/3/dev-congress-budget-watch/";

const base = process.env.REACT_ROUTER_BASENAME
  ? process.env.REACT_ROUTER_BASENAME
  : process.env.NODE_ENV === "development"
    ? DEV_BASE
    : PROD_BASE;

export default defineConfig({
  base,
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), mkcert()],
});
