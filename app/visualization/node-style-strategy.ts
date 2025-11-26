import type * as d3 from "d3";

import type { NodeDatum } from "./helpers";
import {
  BASE_STROKE_WIDTH,
  HOVER_STROKE_WIDTH,
  MAIN_RESOLUTION_STROKE_COLOR,
  MAIN_RESOLUTION_STROKE_DASHARRAY,
  MAIN_RESOLUTION_STROKE_WIDTH,
  WAVE_STROKE_WIDTH,
} from "./circle-pack-config";

type CircularNode = d3.HierarchyCircularNode<NodeDatum>;

type StrokeStyle = {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
};

const DEFAULT_STROKE = "#000";

export const getNodeStrokeStyle = (
  node: CircularNode,
  options?: { hovered?: boolean }
): StrokeStyle => {
  const hovered = Boolean(options?.hovered);
  if (node.data.proposalType === "main-resolution") {
    return {
      stroke: MAIN_RESOLUTION_STROKE_COLOR,
      strokeWidth: hovered
        ? MAIN_RESOLUTION_STROKE_WIDTH + 1
        : MAIN_RESOLUTION_STROKE_WIDTH,
      strokeDasharray: MAIN_RESOLUTION_STROKE_DASHARRAY,
    };
  }

  if (node.data.isFrozen) {
    return {
      stroke: "none",
      strokeWidth: 0,
      strokeDasharray: "none",
    };
  }

  return {
    stroke: DEFAULT_STROKE,
    strokeWidth: hovered ? HOVER_STROKE_WIDTH : BASE_STROKE_WIDTH,
    strokeDasharray: "none",
  };
};

export const getFrozenWaveStrokeWidth = (hovered: boolean) =>
  hovered ? WAVE_STROKE_WIDTH + 1.5 : WAVE_STROKE_WIDTH;


