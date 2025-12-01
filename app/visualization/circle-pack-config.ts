import * as d3 from "d3";

export const ANIMATION_CONFIG = {
  focus: {
    duration: 750,
    slowMultiplier: 10,
    easing: d3.easeCubicOut,
  },
  label: {
    duration: 400,
  },
  thresholds: {
    disableAnimationsAfter: 1000,
  },
} as const;

export const INTERACTION_FLAGS = {
  enableNodeNavigation: true,
} as const;

export const DEFAULT_CHART_WIDTH = 720;
export const MOBILE_BREAKPOINT = 768;
export const GESTURE_HINT_AUTO_HIDE_MS = 2000;
export const GESTURE_HINT_MESSAGE =
  "捏合或滑動即可縮放，點擊後拖曳可以平移";

export const LABEL_CHILDREN_OFFSET_FACTOR = 0.88;
export const HOVER_STROKE_WIDTH = 2;
export const BASE_STROKE_WIDTH = 1;

export const WAVE_STROKE_WIDTH = 6;
export const WAVE_SAMPLES_MULTIPLIER = 6;
export const MAIN_RESOLUTION_STROKE_DASHARRAY = "4,4";
export const MAIN_RESOLUTION_STROKE_COLOR = "#000";
export const MAIN_RESOLUTION_STROKE_WIDTH = 2;

export const SMALL_NODE_RADIUS_THRESHOLD = 18;
export const SMALL_NODE_RANDOM_OFFSET = 28;
export const SMALL_NODE_FORCE_TICKS = 12;
export const SMALL_NODE_FORCE_STRENGTH = 0.08;
export const SMALL_NODE_COLLISION_PADDING = 2;


