import { SortDirection } from "~/constants/enums";
import type { SelectOption } from "~/types/visualization";

export const sortOptions = [
  {
    value: "id-asc",
    label: "編號 (升序)",
    field: "id",
    direction: SortDirection.ASC,
  },
  {
    value: "id-desc",
    label: "編號 (降序)",
    field: "id",
    direction: SortDirection.DESC,
  },
];

export type SortOption = (typeof sortOptions)[number];

export const YEAR_OPTIONS: SelectOption[] = [
  { value: "114", label: "114年度 (2025)" },
  { value: "113", label: "113年度 (2024)" },
];
