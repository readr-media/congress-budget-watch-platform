import * as d3 from "d3";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { FROZEN_PATH_D } from "~/constants/svg-paths";
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
  enableNodeNavigation: false,
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

const CirclePackChart = ({
  data,
  width: customWidth = 720,
  height: customHeight,
  padding = 3,
  onNodeClick,
}: CirclePackChartProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const DEFAULT_CHART_WIDTH = 720;
  const FROZEN_PATH_BASE = 55;
  const FROZEN_OUTER_SCALE = 1.2;
  const FROZEN_INNER_SCALE = 1.13;
  const FROZEN_TRANSLATE_X = -26.5;
  const FROZEN_TRANSLATE_Y = -27.5;
  const LABEL_CHILDREN_OFFSET_FACTOR = 0.88;
  const HOVER_STROKE_WIDTH = 2;
  const BASE_STROKE_WIDTH = 1;

  const createFrozenTransform = useCallback(
    (radius: number, scale: number, zoomFactor = 1) =>
      `scale(${((radius * zoomFactor * 2) / FROZEN_PATH_BASE) * scale}) translate(${FROZEN_TRANSLATE_X}, ${FROZEN_TRANSLATE_Y})`,
    [FROZEN_PATH_BASE, FROZEN_TRANSLATE_X, FROZEN_TRANSLATE_Y]
  );

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
    const focusNode =
      (isMobile && findLargestChild(root)) || root;

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
      .on("mouseover", function () {
        d3
          .select(this)
          .select("circle")
          .attr("stroke-width", HOVER_STROKE_WIDTH);
      })
      .on("mouseout", function () {
        d3
          .select(this)
          .select("circle")
          .attr("stroke-width", BASE_STROKE_WIDTH);
      });

    node
      .filter((d) => !d.data.isFrozen)
      .append("circle")
      .attr("r", (d) => d.r)
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      )
      .attr("stroke", "#000")
      .attr("stroke-width", BASE_STROKE_WIDTH);

    const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);

    // Render an inner circle for the original fill color first
    frozenNodes
      .append("circle")
      .attr("r", (d) => d.r)
      .attr(
        "fill",
        (d) => d.data.color ?? (d.children ? color(d.depth) : "white")
      );

    frozenNodes
      .append("path")
      .attr("class", "frozen-border frozen-border--outer")
      .attr("d", FROZEN_PATH_D)
      .attr("fill", "#FF43D3")
      .attr("transform", (d) =>
        createFrozenTransform(d.r, FROZEN_OUTER_SCALE)
      );

    // Layer 2: Inner border (same color as circle) - creates the thin border effect
    frozenNodes
      .append("path")
      .attr("class", "frozen-border frozen-border--inner")
      .attr("d", FROZEN_PATH_D)
      .attr("fill", (d) => d.data.color ?? "#6B7FFF")
      .attr("transform", (d) =>
        createFrozenTransform(d.r, FROZEN_INNER_SCALE)
      );

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
      .style("font-size", (d) => `${Math.max(10, Math.min(16, d.r / 5))}px`)
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

    let focus: d3.HierarchyCircularNode<NodeDatum> | null =
      initialFocus ?? root;

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
        .filter((d) => !d.data.isFrozen)
        .select("circle")
        .attr("r", (d) => d.r * k)
        .attr("stroke-width", BASE_STROKE_WIDTH);

      const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);
      frozenNodes
        .select<SVGPathElement>(".frozen-border--outer")
        .attr("transform", (d) =>
          createFrozenTransform(d.r, FROZEN_OUTER_SCALE, k)
        );
      frozenNodes
        .select<SVGPathElement>(".frozen-border--inner")
        .attr("transform", (d) =>
          createFrozenTransform(d.r, FROZEN_INNER_SCALE, k)
        );
      frozenNodes.select("circle").attr("r", (d) => d.r * k);
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
      } = {},
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
        (zoomBehavior.transform as unknown as (
          transition: d3.Transition<SVGSVGElement, undefined, null, undefined>,
          transform: d3.ZoomTransform
        ) => void)(transition, transform);
      } else {
        (zoomBehavior.transform as unknown as (
          selection: d3.Selection<SVGSVGElement, undefined, null, undefined>,
          transform: d3.ZoomTransform
        ) => void)(svg, transform);
      }
    };

    const updateLabelVisibility = (
      targetFocus: d3.HierarchyCircularNode<NodeDatum> | null,
      duration = baseLabelDuration,
    ) => {
      const shouldAnimate =
        animationsEnabled && duration !== undefined && duration > 0;

      if (shouldAnimate) {
        label
          .interrupt()
          .transition()
          .duration(duration)
          .ease(d3.easeCubicOut)
          .style("fill-opacity", (dd) => {
            if (!targetFocus) return "0";
            return dd.parent === targetFocus || dd === targetFocus ? "1" : "0";
          })
          .on("start", function () {
            const currentDatum = d3.select(
              this as SVGTextElement
            ).datum() as d3.HierarchyCircularNode<NodeDatum>;
            const shouldShow =
              targetFocus != null &&
              (currentDatum.parent === targetFocus ||
                currentDatum === targetFocus);
            if (shouldShow) {
              (this as SVGTextElement).style.display = "inline";
            }
          })
          .on("end", function () {
            const currentDatum = d3.select(
              this as SVGTextElement
            ).datum() as d3.HierarchyCircularNode<NodeDatum>;
            const shouldShow =
              targetFocus != null &&
              (currentDatum.parent === targetFocus ||
                currentDatum === targetFocus);
            if (!shouldShow) {
              (this as SVGTextElement).style.display = "none";
            }
          });
      } else {
        label
          .interrupt()
          .style("fill-opacity", (dd) => {
            if (!targetFocus) return "0";
            return dd.parent === targetFocus || dd === targetFocus ? "1" : "0";
          })
          .style("display", (dd) => {
            const shouldShow =
              targetFocus != null &&
              (dd.parent === targetFocus || dd === targetFocus);
            return shouldShow ? "inline" : "none";
          });
      }
    };

    let inertiaFrame: number | null = null;
    const recentTransforms: Array<{
      transform: d3.ZoomTransform;
      timestamp: number;
    }> = [];

    const getCurrentTransform = () => {
      const node = svg.node();
      return node ? d3.zoomTransform(node as SVGSVGElement) : d3.zoomIdentity;
    };

    const addTransformHistory = (transform: d3.ZoomTransform) => {
      const now = performance.now();
      recentTransforms.push({ transform, timestamp: now });
      if (recentTransforms.length > ANIMATION_CONFIG.inertia.maxHistory) {
        recentTransforms.shift();
      }
    };

    const clearInertia = () => {
      if (inertiaFrame != null) {
        cancelAnimationFrame(inertiaFrame);
        inertiaFrame = null;
      }
      recentTransforms.length = 0;
    };

    const startInertia = () => {
      if (!inertiaEnabled || recentTransforms.length < 2) return;

      const latest = recentTransforms[recentTransforms.length - 1];
      const previous = recentTransforms[recentTransforms.length - 2];
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

        (zoomBehavior.transform as unknown as (
          selection: d3.Selection<SVGSVGElement, undefined, null, undefined>,
          transform: d3.ZoomTransform
        ) => void)(svg, nextTransform);

        inertiaFrame = requestAnimationFrame(step);
      };

      clearInertia();
      inertiaFrame = requestAnimationFrame(step);
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
        if (event.sourceEvent && focus) {
          focus = null;
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
      target: d3.HierarchyCircularNode<NodeDatum>,
    ) => {
      focus = target;
      clearInertia();
      const isSlow = Boolean(event?.altKey) && animationsEnabled;
      const duration = isSlow ? slowFocusDuration : baseFocusDuration;
      setView(target, { duration });
      updateLabelVisibility(target, baseLabelDuration);
    };

    const resetToRoot = () => {
      focus = root;
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
        INTERACTION_FLAGS.enableNodeNavigation && typeof onNodeClick === "function";
      const callbackResult =
        canNavigate && onNodeClick ? onNodeClick(d.data) : undefined;
      const shouldSkipZoom = callbackResult === true;

      if (shouldSkipZoom) {
        event.stopPropagation();
        return;
      }

      if (focus !== d) {
        focusOnNode(event as unknown as MouseEvent, d);
        event.stopPropagation();
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
    createFrozenTransform,
    BASE_STROKE_WIDTH,
    HOVER_STROKE_WIDTH,
    FROZEN_OUTER_SCALE,
    FROZEN_INNER_SCALE,
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
