import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import type { NodeDatum } from "./helpers";

const ANIMATION_CONFIG = {
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
  inertia: {
    enabled: true,
    maxHistory: 5,
    decay: 0.92,
    minVelocity: 0.02,
    frameInterval: 16,
  },
} as const;

const INTERACTION_FLAGS = {
  enableNodeNavigation: true,
} as const;

const INERTIA_FLAGS = {
  enabled: true,
} as const;

export type CirclePackPadding =
  | number
  | ((node: d3.HierarchyNode<NodeDatum>) => number);

type CirclePackChartProps = {
  data: NodeDatum;
  width?: number;
  height?: number;
  padding?: CirclePackPadding;
  onNodeClick?: (node: NodeDatum) => void | boolean;
};

const MOBILE_BREAKPOINT = 768;

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

const WAVE_STROKE_WIDTH = 6;
const WAVE_SAMPLES_MULTIPLIER = 6;
const MAIN_RESOLUTION_STROKE_DASHARRAY = "4,4";
const MAIN_RESOLUTION_STROKE_COLOR = "#000";
const MAIN_RESOLUTION_STROKE_WIDTH = 2;

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

  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const offset = Math.sin(t * waveCount) * amplitude;
    const r = radius + offset;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    path +=
      i === 0
        ? `M ${x.toFixed(3)} ${y.toFixed(3)}`
        : ` L ${x.toFixed(3)} ${y.toFixed(3)}`;
  }

  return `${path} Z`;
};

const CirclePackChart = ({
  data,
  width: customWidth = 720,
  height: customHeight,
  padding = 3,
  onNodeClick,
}: CirclePackChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<d3.HierarchyCircularNode<NodeDatum> | null>(null);
  const lastFocusedNodeIdRef = useRef<string | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const transformHistoryRef = useRef<
    Array<{ transform: d3.ZoomTransform; timestamp: number }>
  >([]);
  const DEFAULT_CHART_WIDTH = 720;
  const LABEL_CHILDREN_OFFSET_FACTOR = 0.88;
  const HOVER_STROKE_WIDTH = 2;
  const BASE_STROKE_WIDTH = 1;

  const {
    root,
    width,
    height,
    color,
    initialFocus,
    animations,
    animationsEnabled,
    inertiaEnabled,
  } = useMemo(() => {
    const width = customWidth ?? DEFAULT_CHART_WIDTH;
    const height = customHeight ?? width;

    const color = d3
      .scaleLinear<string>()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const paddingAccessor =
      typeof padding === "function" ? padding : () => padding;

    const pack = (data: NodeDatum) =>
      d3
        .pack<NodeDatum>()
        .size([width, height])
        .padding((node) => paddingAccessor(node))(
        d3
          .hierarchy<NodeDatum>(data)
          .sum((d) => (typeof d.value === "number" ? d.value : 0))
          .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
      );

    const root = pack(data);
    const isMobile = width < MOBILE_BREAKPOINT;
    const focusNode = (isMobile && findLargestChild(root)) || root;

    const totalNodes = root.descendants().length;
    const disableAnimations =
      totalNodes > ANIMATION_CONFIG.thresholds.disableAnimationsAfter;
    const inertiaEnabled =
      !disableAnimations &&
      ANIMATION_CONFIG.inertia.enabled &&
      INERTIA_FLAGS.enabled;

    const animations = {
      focus: disableAnimations ? 0 : ANIMATION_CONFIG.focus.duration,
      label: disableAnimations ? 0 : ANIMATION_CONFIG.label.duration,
    };

    return {
      root,
      width,
      height,
      color,
      initialFocus: focusNode,
      animations,
      animationsEnabled: !disableAnimations,
      inertiaEnabled,
    };
  }, [data, customWidth, customHeight, padding]);

  useEffect(() => {
    if (!containerRef.current) return;

    const svg = d3
      .create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr(
        "style",
        `max-width: 100%; height: auto; display: block; cursor: default;`
      );

    const nodesData: d3.HierarchyCircularNode<NodeDatum>[] = root
      .descendants()
      .slice(1) as d3.HierarchyCircularNode<NodeDatum>[];

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .attr("pointer-events", (d) =>
        d.children || d.data.id ? "auto" : "none"
      )
      .style("cursor", (d) =>
        d.data.id ? "pointer" : d.children ? "pointer" : "default"
      )
      .on("mouseover", function (_, d) {
        const selection = d3.select(this);
        if (d.data.isFrozen) {
          selection
            .selectAll<
              SVGPathElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".frozen-wave")
            .attr("stroke-width", WAVE_STROKE_WIDTH + 1.5);
        } else if (d.data.proposalType === "main-resolution") {
          selection
            .selectAll<
              SVGCircleElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".node-base-circle")
            .attr("stroke-width", MAIN_RESOLUTION_STROKE_WIDTH + 1);
        } else {
          selection
            .selectAll<
              SVGCircleElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".node-base-circle")
            .attr("stroke-width", HOVER_STROKE_WIDTH);
        }
      })
      .on("mouseout", function (_, d) {
        const selection = d3.select(this);
        if (d.data.isFrozen) {
          selection
            .selectAll<
              SVGPathElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".frozen-wave")
            .attr("stroke-width", WAVE_STROKE_WIDTH);
        } else if (d.data.proposalType === "main-resolution") {
          selection
            .selectAll<
              SVGCircleElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".node-base-circle")
            .attr("stroke-width", MAIN_RESOLUTION_STROKE_WIDTH);
        } else {
          selection
            .selectAll<
              SVGCircleElement,
              d3.HierarchyCircularNode<NodeDatum>
            >(".node-base-circle")
            .attr("stroke-width", BASE_STROKE_WIDTH);
        }
      });

    node
      .append("circle")
      .attr("class", "node-base-circle")
      .attr("r", (d) => d.r)
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      )
      .attr("stroke", (d) => {
        if (d.data.proposalType === "main-resolution") {
          return MAIN_RESOLUTION_STROKE_COLOR;
        }
        if (d.data.isFrozen) {
          return "none";
        }
        return "#000";
      })
      .attr("stroke-width", (d) =>
        d.data.proposalType === "main-resolution"
          ? MAIN_RESOLUTION_STROKE_WIDTH
          : BASE_STROKE_WIDTH
      )
      .attr("stroke-dasharray", (d) =>
        d.data.proposalType === "main-resolution"
          ? MAIN_RESOLUTION_STROKE_DASHARRAY
          : "none"
      );

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

    const mainResolutionNodes = node.filter(
      (d) => d.data.proposalType === "main-resolution"
    );

    mainResolutionNodes
      .selectAll<
        SVGCircleElement,
        d3.HierarchyCircularNode<NodeDatum>
      >(".node-base-circle")
      .attr("stroke", MAIN_RESOLUTION_STROKE_COLOR)
      .attr("stroke-width", MAIN_RESOLUTION_STROKE_WIDTH)
      .attr("stroke-dasharray", MAIN_RESOLUTION_STROKE_DASHARRAY);

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll<SVGTextElement, d3.HierarchyCircularNode<NodeDatum>>("text")
      .data(
        root.descendants().slice(1) as d3.HierarchyCircularNode<NodeDatum>[]
      )
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? "1" : "0"))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .style("font-size", (d) => `${Math.max(10, Math.min(40, d.r / 5))}px`)
      .style("font-family", "sans-serif")
      .each(function (this: SVGTextElement, d) {
        const textSel = d3.select<
          SVGTextElement,
          d3.HierarchyCircularNode<NodeDatum>
        >(this);
        const name = d.data.name;
        // 支援手動分行：\n 或 |
        const manualLines = name.split(/\n|\|/);
        if (manualLines.length > 1) {
          textSel.text(null);
          const lineHeightEm = 1.1;
          manualLines.forEach((ln, idx) => {
            textSel
              .append("tspan")
              .attr("x", 0)
              .attr("dy", idx === 0 ? "0em" : `${lineHeightEm}em`)
              .text(ln);
          });
          const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
          const total = tspans.size();
          if (total > 1) {
            const offsetEm = -((total - 1) / 2) * lineHeightEm;
            let isFirst = true;
            tspans.each(function () {
              const span = this as SVGTSpanElement;
              span.setAttribute("x", "0");
              span.setAttribute(
                "dy",
                isFirst ? `${offsetEm}em` : `${lineHeightEm}em`
              );
              isFirst = false;
            });
          }
          return;
        }
        const words = name.split(/\s+/);
        // 如果沒有空白可切，就維持單行文字
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
            tspan = textSel
              .append("tspan")
              .attr("x", 0)
              .attr("dy", `${lineHeightEm}em`)
              .text(word);
          }
        }
        // 垂直置中：將第一行往上偏移一半行數
        const tspans = textSel.selectAll<SVGTSpanElement, unknown>("tspan");
        const total = tspans.size();
        if (total > 1) {
          const offsetEm = -((total - 1) / 2) * lineHeightEm;
          let isFirst = true;
          tspans.each(function () {
            const span = this as SVGTSpanElement;
            span.setAttribute("x", "0");
            span.setAttribute(
              "dy",
              isFirst ? `${offsetEm}em` : `${lineHeightEm}em`
            );
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
    const slowFocusDuration =
      animations.focus > 0
        ? animations.focus * ANIMATION_CONFIG.focus.slowMultiplier
        : 0;
    const baseLabelDuration = animations.label;

    const viewToTransform = (v: [number, number, number]): d3.ZoomTransform => {
      const k = width / v[2];
      return d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(k)
        .translate(-v[0], -v[1]);
    };

    const updateSceneForView = (v: [number, number, number]) => {
      const k = width / v[2];
      label.attr("transform", (d) => {
        const x = (d.x - v[0]) * k;
        const y = (d.y - v[1]) * k;
        if (d.children && d.children.length > 0) {
          const offsetY = -d.r * k * LABEL_CHILDREN_OFFSET_FACTOR;
          return `translate(${x}, ${y + offsetY})`;
        }
        return `translate(${x}, ${y})`;
      });
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
      );

      node
        .selectAll<SVGCircleElement, d3.HierarchyCircularNode<NodeDatum>>(
          ".node-base-circle"
        )
        .attr("r", (d) => d.r * k)
        .attr("stroke-width", (d) => {
          if (d.data.proposalType === "main-resolution") {
            return MAIN_RESOLUTION_STROKE_WIDTH;
          }
          return d.data.isFrozen ? 0 : BASE_STROKE_WIDTH;
        })
        .attr("stroke", (d) => {
          if (d.data.proposalType === "main-resolution") {
            return MAIN_RESOLUTION_STROKE_COLOR;
          }
          return d.data.isFrozen ? "none" : "#000";
        })
        .attr("stroke-dasharray", (d) =>
          d.data.proposalType === "main-resolution"
            ? MAIN_RESOLUTION_STROKE_DASHARRAY
            : "none"
        );

      node
        .selectAll<SVGPathElement, d3.HierarchyCircularNode<NodeDatum>>(
          ".frozen-wave"
        )
        .attr("d", (d) => createScallopedPath(d.r * k))
        .attr("stroke-width", WAVE_STROKE_WIDTH);
    };

    const applyZoomTransform = (transform: d3.ZoomTransform) => {
      const k = transform.k;
      const x = (width / 2 - transform.x) / k;
      const y = (height / 2 - transform.y) / k;
      const newView: [number, number, number] = [x, y, width / k];
      updateSceneForView(newView);
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
      const targetView: [number, number, number] = [
        target.x,
        target.y,
        target.r * 2,
      ];
      const transform = viewToTransform(targetView);
      const shouldAnimate =
        animationsEnabled && duration !== undefined && duration > 0;

      if (shouldAnimate) {
        const transition = svg
          .interrupt()
          .transition()
          .duration(duration)
          .ease(easing);
        (
          zoomBehavior.transform as unknown as (
            transition: d3.Transition<
              SVGSVGElement,
              undefined,
              null,
              undefined
            >,
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

    const updateLabelVisibility = (
      targetFocus: d3.HierarchyCircularNode<NodeDatum> | null,
      duration = baseLabelDuration
    ) => {
      const shouldAnimate =
        animationsEnabled && duration !== undefined && duration > 0;
      const resolveVisibility = (
        node: d3.HierarchyCircularNode<NodeDatum>
      ): boolean => {
        if (targetFocus == null) {
          return node.parent === root;
        }
        return node.parent === targetFocus || node === targetFocus;
      };

      if (shouldAnimate) {
        label
          .interrupt()
          .transition()
          .duration(duration)
          .ease(d3.easeCubicOut)
          .style("fill-opacity", (dd) => {
            return resolveVisibility(dd) ? "1" : "0";
          })
          .on("start", function () {
            const currentDatum = d3
              .select(this as SVGTextElement)
              .datum() as d3.HierarchyCircularNode<NodeDatum>;
            const shouldShow = resolveVisibility(currentDatum);
            if (shouldShow) {
              (this as SVGTextElement).style.display = "inline";
            }
          })
          .on("end", function () {
            const currentDatum = d3
              .select(this as SVGTextElement)
              .datum() as d3.HierarchyCircularNode<NodeDatum>;
            const shouldShow = resolveVisibility(currentDatum);
            if (!shouldShow) {
              (this as SVGTextElement).style.display = "none";
            }
          });
      } else {
        label
          .interrupt()
          .style("fill-opacity", (dd) => {
            return resolveVisibility(dd) ? "1" : "0";
          })
          .style("display", (dd) => {
            const shouldShow = resolveVisibility(dd);
            return shouldShow ? "inline" : "none";
          });
      }
    };

    const getCurrentTransform = () => {
      const node = svg.node();
      return node ? d3.zoomTransform(node as SVGSVGElement) : d3.zoomIdentity;
    };

    const addTransformHistory = (transform: d3.ZoomTransform) => {
      const now = performance.now();
      transformHistoryRef.current.push({ transform, timestamp: now });
      if (
        transformHistoryRef.current.length > ANIMATION_CONFIG.inertia.maxHistory
      ) {
        transformHistoryRef.current.shift();
      }
    };

    const clearInertia = () => {
      if (inertiaFrameRef.current != null) {
        cancelAnimationFrame(inertiaFrameRef.current);
        inertiaFrameRef.current = null;
      }
      transformHistoryRef.current.length = 0;
    };

    const startInertia = () => {
      if (!inertiaEnabled || transformHistoryRef.current.length < 2) return;

      const latest =
        transformHistoryRef.current[transformHistoryRef.current.length - 1];
      const previous =
        transformHistoryRef.current[transformHistoryRef.current.length - 2];
      const dt = (latest.timestamp - previous.timestamp) / 1000; // seconds
      if (dt <= 0) return;

      let velocityX = (latest.transform.x - previous.transform.x) / dt;
      let velocityY = (latest.transform.y - previous.transform.y) / dt;

      const decay = ANIMATION_CONFIG.inertia.decay;
      const minVelocity = ANIMATION_CONFIG.inertia.minVelocity;

      const step = () => {
        velocityX *= decay;
        velocityY *= decay;

        if (
          Math.abs(velocityX) < minVelocity &&
          Math.abs(velocityY) < minVelocity
        ) {
          clearInertia();
          return;
        }

        const currentTransform = getCurrentTransform();
        const deltaX =
          velocityX * (ANIMATION_CONFIG.inertia.frameInterval / 1000);
        const deltaY =
          velocityY * (ANIMATION_CONFIG.inertia.frameInterval / 1000);
        const nextTransform = currentTransform.translate(deltaX, deltaY);

        (
          zoomBehavior.transform as unknown as (
            selection: d3.Selection<SVGSVGElement, undefined, null, undefined>,
            transform: d3.ZoomTransform
          ) => void
        )(svg, nextTransform);

        inertiaFrameRef.current = requestAnimationFrame(step);
      };

      clearInertia();
      inertiaFrameRef.current = requestAnimationFrame(step);
    };

    // 建立 d3-zoom behavior，用於程式化縮放與使用者拖曳平移
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10]) // 限制縮放範圍：最小 0.5 倍，最大 10 倍
      .filter((event) => {
        if (event.type === "wheel") return false;
        if ("touches" in event && event.touches && event.touches.length > 1) {
          return false;
        }
        return true;
      })
      .on("start", (event) => {
        clearInertia();
        if (event.sourceEvent && focusRef.current) {
          setFocus(null);
          updateLabelVisibility(null, baseLabelDuration);
        }
      })
      .on("zoom", (event) => {
        applyZoomTransform(event.transform);
        addTransformHistory(event.transform);
      })
      .on("end", (event) => {
        if (event.sourceEvent) {
          startInertia();
        }
      });

    const focusOnNode = (
      event: (MouseEvent & { altKey?: boolean }) | null,
      target: d3.HierarchyCircularNode<NodeDatum>
    ) => {
      setFocus(target);
      clearInertia();
      const isSlow = Boolean(event?.altKey) && animationsEnabled;
      const duration = isSlow ? slowFocusDuration : baseFocusDuration;
      setView(target, { duration });
      updateLabelVisibility(target, baseLabelDuration);
    };

    const resetToRoot = () => {
      setFocus(root);
      clearInertia();
      setView(root, { duration: baseFocusDuration });
      updateLabelVisibility(root, baseLabelDuration);
    };

    // 設定初始視圖
    const initialTarget = initialFocus ?? root;
    setView(initialTarget, { duration: 0 });
    updateLabelVisibility(initialTarget, 0);

    if (!animationsEnabled && process.env.NODE_ENV !== "production") {
      console.warn(
        "[CirclePackChart] Animations disabled due to node count exceeding threshold."
      );
    }

    // initial interactions 與拖曳綁定
    svg.call(
      zoomBehavior as unknown as (
        selection: d3.Selection<SVGSVGElement, undefined, null, undefined>
      ) => void
    );
    svg.on("click", (event) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;
      resetToRoot();
    });

    node.on("click", (event, d) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;

      const canNavigate =
        INTERACTION_FLAGS.enableNodeNavigation &&
        typeof onNodeClick === "function";

      const hasChildren = d.children && d.children.length > 0;

      if (hasChildren) {
        // if hasChildren zoom in
        focusOnNode(event as unknown as MouseEvent, d);
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

    // mount
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg.node() as SVGSVGElement);

    // cleanup
    return () => {
      clearInertia();
      svg.remove();
    };
  }, [
    root,
    width,
    height,
    color,
    onNodeClick,
    BASE_STROKE_WIDTH,
    HOVER_STROKE_WIDTH,
    LABEL_CHILDREN_OFFSET_FACTOR,
    initialFocus,
    animations.focus,
    animations.label,
    animationsEnabled,
    inertiaEnabled,
  ]);

  return (
    <div className="flex w-full items-center justify-center">
      <div ref={containerRef} />
    </div>
  );
};

export default CirclePackChart;
