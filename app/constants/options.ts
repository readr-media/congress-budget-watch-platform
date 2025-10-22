import { SortDirection } from '~/constants/enums';

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
