export const resolveMode = () => {
  if (
    typeof import.meta !== "undefined" &&
    typeof import.meta.env !== "undefined" &&
    import.meta.env.MODE
  ) {
    return import.meta.env.MODE;
  }

  if (typeof process !== "undefined") {
    return process.env.NODE_ENV ?? null;
  }

  return null;
};

export const IS_DEV = resolveMode() !== "production";
