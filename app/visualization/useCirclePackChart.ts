import * as d3 from "d3";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";

import { useGestureHint } from "../hooks/useGestureHint";
import {
  ANIMATION_CONFIG,
  DEFAULT_CHART_WIDTH,
  GESTURE_HINT_AUTO_HIDE_MS,
  INTERACTION_FLAGS,
  LABEL_CHILDREN_OFFSET_FACTOR,
  MOBILE_BREAKPOINT,
  SMALL_NODE_COLLISION_PADDING,
  SMALL_NODE_FORCE_STRENGTH,
  SMALL_NODE_FORCE_TICKS,
  SMALL_NODE_RADIUS_THRESHOLD,
  SMALL_NODE_RANDOM_OFFSET,
  WAVE_SAMPLES_MULTIPLIER,
  WAVE_STROKE_WIDTH,
} from "./circle-pack-config";
import type { CirclePackChartProps, CirclePackPadding } from "./circle-pack-types";
import { getFrozenWaveStrokeWidth, getNodeStrokeStyle } from "./node-style-strategy";
import type { NodeDatum } from "./helpers";

type CirclePackCommands = {
  zoomBy: (scale: number) => void;
  resetToRoot: () => void;
  focusNode: (id: string) => void;
};

export type UseCirclePackChartResult = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  gestureHintVisible: boolean;
  dismissGestureHint: () => void;
  commands: CirclePackCommands & {
    zoomIn: () => void;
    zoomOut: () => void;
  };
};

type RandomizedSmallNode = {
  id: string;
  x: number;
  y: number;
  r: number;
  targetX: number;
  targetY: number;
};

const findLargestChild = (
  node: d3.HierarchyCircularNode<NodeDatum>
): d3.HierarchyCircularNode<NodeDatum> | null => {
  if (!node.children || node.children.length === 0) {
    return null;
  }
  return node.children.reduce((largest, current) => {
    const largestValue = largest.value ?? 0;
    const currentValue = current.value ?? 0;
    return currentValue > largestValue ? current : largest;
  }, node.children[0]);
};

const getWaveCountForRadius = (radius: number) => {
  if (radius < 60) return 8;
  if (radius < 120) return 14;
  return 20;
};

const getAmplitudeForRadius = (radius: number) => {
  if (radius < 60) return 0.06;
  if (radius < 120) return 0.04;
  return 0.025;
};

const createScallopedPath = (radius: number) => {
  const waveCount = getWaveCountForRadius(radius);
  const amplitudeRatio = getAmplitudeForRadius(radius);
  const amplitude = radius * amplitudeRatio;
  const samples = Math.max(32, Math.round(waveCount * WAVE_SAMPLES_MULTIPLIER));
  let path = "";

  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * Math.PI * 2;
    const offset = Math.sin(t * waveCount) * amplitude;
    const r = radius + offset;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    path += i === 0 ? `M ${x.toFixed(3)} ${y.toFixed(3)}` : ` L ${x.toFixed(3)} ${y.toFixed(3)}`;
  }

  return `${path} Z`;
};

const sanitizeNodeValue = (value: number | undefined): number => {
  if (typeof value !== "number") return 0;
  if (!isFinite(value)) return 0;
  if (value < 0) return 0;
  return value;
};

const sanitizeNodeData = (node: NodeDatum): NodeDatum => {
  const sanitized: NodeDatum = {
    ...node,
    value: sanitizeNodeValue(node.value),
  };

  if (node.children && node.children.length > 0) {
    sanitized.children = node.children.map(sanitizeNodeData);
  }

  return sanitized;
};

const buildHierarchy = (
  data: NodeDatum,
  width: number,
  height: number,
  paddingAccessor: (node: d3.HierarchyNode<NodeDatum>) => number
) => {
  // Validate dimensions
  const validWidth = isFinite(width) && width > 0 ? width : DEFAULT_CHART_WIDTH;
  const validHeight = isFinite(height) && height > 0 ? height : validWidth;

  // Sanitize data to ensure all values are valid
  const sanitizedData = sanitizeNodeData(data);

  return d3
    .pack<NodeDatum>()
    .size([validWidth, validHeight])
    .padding((node) => {
      const padding = paddingAccessor(node);
      return isFinite(padding) && padding >= 0 ? padding : 3;
    })(
    d3
      .hierarchy<NodeDatum>(sanitizedData)
      .sum((d) => sanitizeNodeValue(d.value))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  );
};

const buildRandomizedSmallNodePositions = (
  root: d3.HierarchyCircularNode<NodeDatum>
) => {
  const leaves = root
    .descendants()
    .filter(
      (node) =>
        (!node.children || node.children.length === 0) &&
        node.r <= SMALL_NODE_RADIUS_THRESHOLD
    );

  if (leaves.length === 0) {
    return new Map<string, { x: number; y: number }>();
  }

  const simulationNodes: RandomizedSmallNode[] = leaves.map((node) => {
    const baseX = node.x ?? 0;
    const baseY = node.y ?? 0;
    return {
      id: node.data.id,
      x: baseX,
      y: baseY,
      r: node.r,
      targetX: baseX + (Math.random() - 0.5) * SMALL_NODE_RANDOM_OFFSET,
      targetY: baseY + (Math.random() - 0.5) * SMALL_NODE_RANDOM_OFFSET,
    };
  });

  const simulation = d3
    .forceSimulation<RandomizedSmallNode>(simulationNodes)
    .force(
      "x",
      d3.forceX<RandomizedSmallNode>((node) => node.targetX).strength(SMALL_NODE_FORCE_STRENGTH)
    )
    .force(
      "y",
      d3.forceY<RandomizedSmallNode>((node) => node.targetY).strength(SMALL_NODE_FORCE_STRENGTH)
    )
    .force(
      "collide",
      d3.forceCollide<RandomizedSmallNode>().radius((node) => node.r + SMALL_NODE_COLLISION_PADDING)
    );

  simulation.stop();
  for (let i = 0; i < SMALL_NODE_FORCE_TICKS; i += 1) {
    simulation.tick();
  }
  simulation.stop();

  const positionMap = new Map<string, { x: number; y: number }>();
  simulationNodes.forEach((node) => {
    positionMap.set(node.id, { x: node.x, y: node.y });
  });

  return positionMap;
};

export const useCirclePackChart = ({
  data,
  width: customWidth = DEFAULT_CHART_WIDTH,
  height: customHeight,
  padding = 3,
  onNodeClick,
}: CirclePackChartProps): UseCirclePackChartResult => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<d3.Selection<SVGSVGElement, undefined, null, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, undefined> | null>(null);
  const focusRef = useRef<d3.HierarchyCircularNode<NodeDatum> | null>(null);
  const lastFocusedNodeIdRef = useRef<string | null>(null);
  const commandsRef = useRef<CirclePackCommands>({
    zoomBy: () => {},
    resetToRoot: () => {},
    focusNode: () => {},
  });

  const {
    visible: gestureHintVisible,
    dismissHint: dismissGestureHint,
    showHint: showGestureHint,
  } = useGestureHint({ autoHideMs: GESTURE_HINT_AUTO_HIDE_MS });

  const { root, width, height, color, initialFocus, animations, animationsEnabled } = useMemo(() => {
    // Validate data structure
    if (!data || !data.id) {
      // Return a minimal valid hierarchy if data is invalid
      const fallbackData: NodeDatum = {
        id: "empty",
        name: "empty",
        value: 0,
        children: [],
      };
      const widthValue = DEFAULT_CHART_WIDTH;
      const heightValue = widthValue;
      const colorScale = d3
        .scaleLinear<string>()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
      const paddingAccessor = typeof padding === "function" ? padding : () => (typeof padding === "number" ? padding : 3);
      const hierarchy = buildHierarchy(fallbackData, widthValue, heightValue, paddingAccessor);
      return {
        root: hierarchy,
        width: widthValue,
        height: heightValue,
        color: colorScale,
        initialFocus: hierarchy,
        animations: {
          focus: 0,
          label: 0,
        },
        animationsEnabled: false,
      };
    }

    const widthValue = customWidth ?? DEFAULT_CHART_WIDTH;
    const heightValue =
      typeof customHeight === "number" && customHeight > 0 ? customHeight : widthValue;

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const paddingAccessor: (node: d3.HierarchyNode<NodeDatum>) => number =
      typeof padding === "function"
        ? padding
        : () => padding as Exclude<CirclePackPadding, (node: d3.HierarchyNode<NodeDatum>) => number>;

    const hierarchy = buildHierarchy(data, widthValue, heightValue, paddingAccessor);
    const isMobile = widthValue < MOBILE_BREAKPOINT;
    const focusNode = (isMobile && findLargestChild(hierarchy)) || hierarchy;
    const totalNodes = hierarchy.descendants().length;
    const disableAnimations =
      totalNodes > ANIMATION_CONFIG.thresholds.disableAnimationsAfter;

    return {
      root: hierarchy,
      width: widthValue,
      height: heightValue,
      color: colorScale,
      initialFocus: focusNode,
      animations: {
        focus: disableAnimations ? 0 : ANIMATION_CONFIG.focus.duration,
        label: disableAnimations ? 0 : ANIMATION_CONFIG.label.duration,
      },
      animationsEnabled: !disableAnimations,
    };
  }, [customWidth, customHeight, data, padding]);

  const randomizedSmallNodePositions = useMemo(
    () => buildRandomizedSmallNodePositions(root),
    [root]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = () => {
      showGestureHint();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [showGestureHint]);

  useEffect(() => {
    showGestureHint();
  }, [showGestureHint]);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = d3
      .create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto; display: block; cursor: default;`);

    svgRef.current = svg;

    const nodesData: d3.HierarchyCircularNode<NodeDatum>[] = root
      .descendants()
      .slice(1) as d3.HierarchyCircularNode<NodeDatum>[];

    const getRenderedCoords = (node: d3.HierarchyCircularNode<NodeDatum>): { x: number; y: number } => {
      const override = randomizedSmallNodePositions.get(node.data.id);
      if (override) {
        return override;
      }
      return { x: node.x ?? 0, y: node.y ?? 0 };
    };

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .attr("pointer-events", (d) => (d.children || d.data.id ? "auto" : "none"))
      .style("cursor", (d) => (d.data.id ? "pointer" : d.children ? "pointer" : "default"))
      .on("mouseover", function (_, d) {
        const selection = d3.select(this);
        if (d.data.isFrozen) {
          selection
            .selectAll<SVGPathElement, d3.HierarchyCircularNode<NodeDatum>>(".frozen-wave")
            .attr("stroke-width", getFrozenWaveStrokeWidth(true));
        }
        const hoveredStyle = getNodeStrokeStyle(d, { hovered: true });
        selection
          .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(".node-base-circle")
          .attr("stroke", hoveredStyle.stroke)
          .attr("stroke-width", hoveredStyle.strokeWidth)
          .attr("stroke-dasharray", hoveredStyle.strokeDasharray);
      })
      .on("mouseout", function (_, d) {
        const selection = d3.select(this);
        if (d.data.isFrozen) {
          selection
            .selectAll<SVGPathElement, d3.HierarchyCircularNode<NodeDatum>>(".frozen-wave")
            .attr("stroke-width", getFrozenWaveStrokeWidth(false));
        }
        const baseStyle = getNodeStrokeStyle(d);
        selection
          .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(".node-base-circle")
          .attr("stroke", baseStyle.stroke)
          .attr("stroke-width", baseStyle.strokeWidth)
          .attr("stroke-dasharray", baseStyle.strokeDasharray);
      });

    node
      .append("circle")
      .attr("class", "node-base-circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.data.color ?? (d.children ? color(d.depth) : "white"))
      .attr("stroke", (d) => getNodeStrokeStyle(d).stroke)
      .attr("stroke-width", (d) => getNodeStrokeStyle(d).strokeWidth)
      .attr("stroke-dasharray", (d) => getNodeStrokeStyle(d).strokeDasharray);

    const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);

    frozenNodes
      .append("path")
      .attr("class", "frozen-wave")
      .attr("fill", "none")
      .attr("stroke", "#ff40c8")
      .attr("stroke-width", WAVE_STROKE_WIDTH)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", (d) => createScallopedPath(d.r));

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll<SVGTextElement, d3.HierarchyCircularNode<NodeDatum>>("text")
      .data(root.descendants().slice(1) as d3.HierarchyCircularNode<NodeDatum>[])
      .join("text")
      .style("fill-opacity", "1")
      .style("display", "inline")
      .style("font-size", (d) => `${Math.max(10, Math.min(40, d.r / 5))}px`)
      .style("font-family", "sans-serif")
      .each(function (this: SVGTextElement, d) {
        const textSel = d3.select<SVGTextElement, d3.HierarchyCircularNode<NodeDatum>>(this);
        const name = d.data.name;
        const manualLines = name.split(/\n|\|/);
        if (manualLines.length > 1) {
          textSel.text(null);
          const lineHeightEm = 1.1;
          manualLines.forEach((ln, idx) => {
            textSel.append("tspan").attr("x", 0).attr("dy", idx === 0 ? "0em" : `${lineHeightEm}em`).text(ln);
          });
          const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
          const total = tspans.size();
          if (total > 1) {
            const offsetEm = -((total - 1) / 2) * lineHeightEm;
            let isFirst = true;
            tspans.each(function () {
              const span = this as SVGTSpanElement;
              span.setAttribute("x", "0");
              span.setAttribute("dy", isFirst ? `${offsetEm}em` : `${lineHeightEm}em`);
              isFirst = false;
            });
          }
          return;
        }
        const words = name.split(/\s+/);
        if (words.length <= 1) {
          textSel.text(name);
          return;
        }
        const lineHeightEm = 1.1;
        const maxWidth = Math.max(24, d.r * 1.6);
        textSel.text(null);
        let line: string[] = [];
        let tspan = textSel.append("tspan").attr("x", 0).attr("dy", "0em");
        for (const word of words) {
          line.push(word);
          tspan.text(line.join(" "));
          const len = (tspan.node() as SVGTextElement).getComputedTextLength();
          if (len > maxWidth && line.length > 1) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = textSel.append("tspan").attr("x", 0).attr("dy", `${lineHeightEm}em`).text(word);
          }
        }
        const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
        const total = tspans.size();
        if (total > 1) {
          const offsetEm = -((total - 1) / 2) * lineHeightEm;
          let isFirst = true;
          tspans.each(function () {
            const span = this as SVGTSpanElement;
            span.setAttribute("x", "0");
            span.setAttribute("dy", isFirst ? `${offsetEm}em` : `${lineHeightEm}em`);
            isFirst = false;
          });
        }
      });

    const setFocus = (target: d3.HierarchyCircularNode<NodeDatum> | null) => {
      focusRef.current = target;
      lastFocusedNodeIdRef.current = target?.data.id ?? null;
    };

    setFocus(initialFocus ?? root);

    const baseFocusDuration = animations.focus;
    const baseLabelDuration = animations.label;

    const viewToTransform = (v: [number, number, number]): d3.ZoomTransform => {
      const k = width / v[2];
      return d3.zoomIdentity.scale(k).translate(-v[0], -v[1]);
    };

    const renderWithTransform = (transform: d3.ZoomTransform) => {
      const k = transform.k;

      label
        .attr("transform", (d) => {
          const { x: nodeX, y: nodeY } = getRenderedCoords(d);
          const anchorY =
            d.children && d.children.length > 0
              ? nodeY - d.r * LABEL_CHILDREN_OFFSET_FACTOR
              : nodeY;
          const [x, y] = transform.apply([nodeX, anchorY]);
          return `translate(${x}, ${y})`;
        })
        .style("font-size", (d) => `${Math.max(10, Math.min(40, (d.r * k) / 5))}px`);

      node.attr("transform", (d) => {
        const { x: nodeX, y: nodeY } = getRenderedCoords(d);
        const [x, y] = transform.apply([nodeX, nodeY]);
        return `translate(${x},${y})`;
      });

      node
        .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(".node-base-circle")
        .attr("r", (d) => d.r * k)
        .attr("stroke", (d) => getNodeStrokeStyle(d).stroke)
        .attr("stroke-width", (d) => getNodeStrokeStyle(d).strokeWidth)
        .attr("stroke-dasharray", (d) => getNodeStrokeStyle(d).strokeDasharray);

      node
        .selectAll<SVGPathElement, d3.HierarchyCircularNode<NodeDatum>>(".frozen-wave")
        .attr("d", (d) => createScallopedPath(d.r * k))
        .attr("stroke-width", WAVE_STROKE_WIDTH);
    };

    const setView = (
      target: d3.HierarchyCircularNode<NodeDatum>,
      {
        duration = baseFocusDuration,
        easing = ANIMATION_CONFIG.focus.easing,
      }: {
        duration?: number;
        easing?: (normalizedTime: number) => number;
      } = {}
    ) => {
      const { x: targetX, y: targetY } = getRenderedCoords(target);
      const targetView: [number, number, number] = [targetX, targetY, target.r * 2];
      const transform = viewToTransform(targetView);
      const shouldAnimate = animationsEnabled && duration !== undefined && duration > 0;

      if (shouldAnimate) {
        const transition = svg.interrupt().transition().duration(duration).ease(easing);
        (
          zoomBehavior.transform as unknown as (
            transition: d3.Transition<SVGSVGElement, undefined, null, undefined>,
            transform: d3.ZoomTransform
          ) => void
        )(transition, transform);
      } else {
        (
          zoomBehavior.transform as unknown as (
            selection: d3.Selection<SVGSVGElement, undefined, null, undefined>,
            transform: d3.ZoomTransform
          ) => void
        )(svg, transform);
      }
    };

    const updateLabelVisibility = (duration = baseLabelDuration) => {
      const shouldAnimate = animationsEnabled && duration !== undefined && duration > 0;

      if (shouldAnimate) {
        label
          .interrupt()
          .transition()
          .duration(duration)
          .ease(d3.easeCubicOut)
          .style("fill-opacity", "1")
          .on("start", function () {
            (this as SVGTextElement).style.display = "inline";
          });
      } else {
        label.interrupt().style("fill-opacity", "1").style("display", "inline");
      }
    };

    const focusOnNode = (target: d3.HierarchyCircularNode<NodeDatum>) => {
      setFocus(target);
      setView(target, { duration: baseFocusDuration });
      updateLabelVisibility(baseLabelDuration);
    };

    const zoomBehavior = d3
      .zoom<SVGSVGElement, undefined>()
      .scaleExtent([0.5, 10])
      .filter((event) => {
        if (event.type === "wheel") {
          return event.ctrlKey || event.metaKey;
        }
        return true;
      })
      .on("zoom", (event) => {
        if (
          event.sourceEvent?.type === "wheel" ||
          event.sourceEvent?.type === "touchmove"
        ) {
          event.sourceEvent.preventDefault();
        }
        renderWithTransform(event.transform);
      });

    zoomRef.current = zoomBehavior;

    const resetToRoot = () => {
      focusOnNode(root);
    };

    commandsRef.current = {
      zoomBy: (scale) => {
        if (!svgRef.current || !zoomRef.current) return;
        svgRef.current.transition().duration(300).call(zoomRef.current.scaleBy, scale);
      },
      resetToRoot: () => {
        resetToRoot();
      },
      focusNode: (nodeId) => {
        const target = root
          .descendants()
          .find((desc) => desc.data.id === nodeId);
        if (target) {
          focusOnNode(target);
        }
      },
    };

    const initialTarget = initialFocus ?? root;
    setView(initialTarget, { duration: 0 });
    updateLabelVisibility(0);

    if (!animationsEnabled && process.env.NODE_ENV !== "production") {
      console.warn(
        "[CirclePackChart] Animations disabled due to node count exceeding threshold."
      );
    }

    svg.call(
      zoomBehavior as unknown as (
        selection: d3.Selection<SVGSVGElement, undefined, null, undefined>
      ) => void
    );
    svg.on("click", (event) => {
      if (event.defaultPrevented) return;
      dismissGestureHint();
      resetToRoot();
    });

    node.on("click", (event, d) => {
      if (event.defaultPrevented) return;
      dismissGestureHint();

      const canNavigate =
        INTERACTION_FLAGS.enableNodeNavigation && typeof onNodeClick === "function";

      const hasChildren = d.children && d.children.length > 0;

      if (hasChildren) {
        event.stopPropagation();
        return;
      }

      if (canNavigate && onNodeClick) {
        const result = onNodeClick(d.data);
        if (result !== false) {
          lastFocusedNodeIdRef.current = null;
          event.stopPropagation();
        }
      }
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg.node() as SVGSVGElement);

    return () => {
      svg.remove();
    };
  }, [
    animations.focus,
    animations.label,
    animationsEnabled,
    color,
    dismissGestureHint,
    height,
    initialFocus,
    onNodeClick,
    randomizedSmallNodePositions,
    root,
    width,
  ]);

  const zoomBy = useCallback((scale: number) => {
    commandsRef.current.zoomBy(scale);
  }, []);

  const zoomIn = useCallback(() => zoomBy(1.2), [zoomBy]);
  const zoomOut = useCallback(() => zoomBy(0.8), [zoomBy]);

  return {
    containerRef,
    gestureHintVisible,
    dismissGestureHint,
    commands: {
      zoomBy,
      zoomIn,
      zoomOut,
      resetToRoot: () => commandsRef.current.resetToRoot(),
      focusNode: (id: string) => commandsRef.current.focusNode(id),
    },
  };
};


