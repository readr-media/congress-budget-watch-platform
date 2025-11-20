export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatLegislator = (legislator: {
  name?: string | null;
}): string => {
  return legislator.name || "";
};

export const formatParty = (party?: { name?: string | null }): string => {
  return party?.name || "";
};

export const toCurrentYear = (date: string): string => {
  return new Date(date).getFullYear().toString();
};

export const formatTermRange = (termRange: {
  first: number | null;
  last: number | null;
}): string => {
  if (!termRange.first || !termRange.last) {
    return "";
  }
  if (termRange.first === termRange.last) {
    return String(termRange.first);
  }
  return `${termRange.first} ~ ${termRange.last}`;
};
