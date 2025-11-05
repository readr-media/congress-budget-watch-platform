import type { Config } from "@react-router/dev/config";

const PROD_BASENAME = "/project/3/congress-budget-watch/";
const DEV_BASENAME = "/project/3/dev-congress-budget-watch/";

const basename =
  process.env.REACT_ROUTER_BASENAME ??
  (process.env.NODE_ENV === "development" ? DEV_BASENAME : PROD_BASENAME);

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  basename,
} satisfies Config;
