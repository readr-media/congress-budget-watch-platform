const baseUrl = (
  import.meta.env.BASE_URL ??
  process.env.REACT_ROUTER_BASENAME ??
  "/congress-budget-watch-platform/"
).replace(/\/$/, "");

export const STATIC_ASSETS_PREFIX = `${baseUrl}/`;

export const SEARCH_DEBOUNCE_DELAY = 500;
