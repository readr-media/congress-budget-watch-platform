export const getLatestBudgetYearValue = (
  budgetYears?: Array<{ year?: number | null } | null> | null
) => {
  const years = (budgetYears ?? [])
    .map((entry) => entry?.year)
    .filter((year): year is number => typeof year === "number");
  return years.length ? years[0] : null;
};
