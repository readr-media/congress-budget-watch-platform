import { resolveMode } from "../utils/env";

const PROD_GQL_ENDPOINT =
  "https://ly-budget-gql-prod-702918025200.asia-east1.run.app/api/graphql";
const DEV_GQL_ENDPOINT =
  "https://ly-budget-dev-702918025200.asia-east1.run.app/api/graphql";

const resolveEnvEndpoint = () => {
  if (
    typeof import.meta !== "undefined" &&
    typeof import.meta.env !== "undefined" &&
    import.meta.env.VITE_GQL_ENDPOINT
  ) {
    return import.meta.env.VITE_GQL_ENDPOINT as string;
  }

  if (typeof process !== "undefined") {
    return (
      process.env.VITE_GQL_ENDPOINT ??
      process.env.GQL_ENDPOINT ??
      process.env.GRAPHQL_ENDPOINT ??
      null
    );
  }

  return null;
};

const envEndpoint = resolveEnvEndpoint();
const mode = resolveMode();

const GQL_ENDPOINTS =
  envEndpoint ??
  (mode === "production" ? PROD_GQL_ENDPOINT : DEV_GQL_ENDPOINT);

const ERROR_REDIRECT_ROUTE = "/";
export { GQL_ENDPOINTS, ERROR_REDIRECT_ROUTE };
