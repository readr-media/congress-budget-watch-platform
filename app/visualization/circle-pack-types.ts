import type * as d3 from "d3";

import type { NodeDatum } from "./helpers";

export type CirclePackPadding =
  | number
  | ((node: d3.HierarchyNode<NodeDatum>) => number);

export type CirclePackChartProps = {
  data: NodeDatum;
  width?: number;
  height?: number;
  padding?: CirclePackPadding;
  onNodeClick?: (node: NodeDatum) => void | boolean;
};


