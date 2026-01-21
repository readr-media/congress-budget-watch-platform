const isDev = import.meta.env?.MODE !== "production";

export const getCalculatedRepublicYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear - 1911;
};

/**
 * The default republic year to use across the application.
 * In development, we fallback to 114 for testing purposes if the current year has no data.
 */
export const DEFAULT_REPUBLIC_YEAR = isDev
  ? 114
  : getCalculatedRepublicYear();
