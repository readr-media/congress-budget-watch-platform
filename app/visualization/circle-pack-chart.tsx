import * as d3 from "d3";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { FROZEN_PATH_D } from "~/constants/svg-paths";
import type { NodeDatum } from "./helpers";

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

  const { root, width, height, color, initialFocus } = useMemo(() => {
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

    return { root, width, height, color, initialFocus: focusNode };
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

    let focus: d3.HierarchyCircularNode<NodeDatum> = initialFocus;

    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];
      label.attr("transform", (d) => {
        const x = (d.x - v[0]) * k;
        const y = (d.y - v[1]) * k;
        // 如果有子節點，將文字移到圓圈頂部
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

      // Adapt scaling for different node types
      node
        .filter((d) => !d.data.isFrozen)
        .select("circle")
        .attr("r", (d) => d.r * k)
        .attr("stroke-width", BASE_STROKE_WIDTH);

      const frozenNodes = node.filter((d) => d.data.isFrozen ?? false);
      // Update outer border (first path)
      frozenNodes
        .select<SVGPathElement>(".frozen-border--outer")
        .attr(
          "transform",
          (d) => createFrozenTransform(d.r, FROZEN_OUTER_SCALE, k)
        );
      // Update inner border (second path)
      frozenNodes
        .select<SVGPathElement>(".frozen-border--inner")
        .attr(
          "transform",
          (d) => createFrozenTransform(d.r, FROZEN_INNER_SCALE, k)
        );
      frozenNodes.select("circle").attr("r", (d) => d.r * k);
    }

    // 將 view 轉換為 d3.ZoomTransform
    function viewToTransform(v: [number, number, number]): d3.ZoomTransform {
      const k = width / v[2];
      return d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(k)
        .translate(-v[0], -v[1]);
    }

    // 從 d3.ZoomTransform 更新視圖
    function applyZoomTransform(transform: d3.ZoomTransform) {
      const k = transform.k;
      const x = (width / 2 - transform.x) / k;
      const y = (height / 2 - transform.y) / k;
      const newView: [number, number, number] = [x, y, width / k];
      zoomTo(newView);
    }

    // 建立 d3-zoom behavior，用於程式化縮放與使用者拖曳平移
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 10]) // 限制縮放範圍：最小 0.5 倍，最大 10 倍
      .filter((event) => {
        // 禁用滑鼠滾輪或雙指手勢的縮放，只保留滑鼠/觸控拖曳
        if (event.type === "wheel") return false;
        return true;
      })
      .on("zoom", (event) => {
        // 這個事件處理器只會在程式化縮放時被觸發
        applyZoomTransform(event.transform);
      });

    function zoom(
      event: (MouseEvent & { altKey?: boolean }) | null,
      d: d3.HierarchyCircularNode<NodeDatum>
    ) {
      focus = d;
      const isSlow = Boolean(event?.altKey);
      const targetView: [number, number, number] = [
        focus.x,
        focus.y,
        focus.r * 2,
      ];

      // 使用 d3-zoom 的程式化縮放
      svg
        .transition()
        .duration(isSlow ? 7500 : 750)
        .call(
          zoomBehavior.transform as (
            transition: d3.Transition<
              SVGSVGElement,
              undefined,
              null,
              undefined
            >,
            transform: d3.ZoomTransform
          ) => void,
          viewToTransform(targetView)
        )
        .on("end", () => {
          // 更新標籤顯示
          label
            .style("fill-opacity", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
              dd.parent === focus || dd === focus ? "1" : "0"
            )
            .style("display", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
              dd.parent === focus || dd === focus ? "inline" : "none"
            );
        });

      // 立即開始標籤過渡動畫
      label
        .transition()
        .duration(isSlow ? 7500 : 750)
        .style("fill-opacity", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
          dd.parent === focus || dd === focus ? "1" : "0"
        )
        .on(
          "start",
          function (
            this: SVGTextElement,
            dd: d3.HierarchyCircularNode<NodeDatum>
          ) {
            if (dd.parent === focus || dd === focus)
              this.style.display = "inline";
          }
        )
        .on(
          "end",
          function (
            this: SVGTextElement,
            dd: d3.HierarchyCircularNode<NodeDatum>
          ) {
            if (dd.parent !== focus && dd !== focus)
              this.style.display = "none";
          }
        );
    }

    // 設定初始視圖
    const initialTarget = initialFocus ?? root;
    const initialView: [number, number, number] = [
      initialTarget.x,
      initialTarget.y,
      initialTarget.r * 2,
    ];
    zoomTo(initialView);
    label
      .style("fill-opacity", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
        dd.parent === focus || dd === focus ? "1" : "0"
      )
      .style("display", (dd: d3.HierarchyCircularNode<NodeDatum>) =>
        dd.parent === focus || dd === focus ? "inline" : "none"
      );

    // initial interactions 與拖曳綁定
    svg.call(zoomBehavior as unknown as (selection: d3.Selection<SVGSVGElement, undefined, null, undefined>) => void);
    svg.on("click", (event) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;
      zoom(event as unknown as MouseEvent, root);
    });

    node.on("click", (event, d) => {
      // 防止在拖曳後觸發點擊
      if (event.defaultPrevented) return;

      const callbackResult = onNodeClick?.(d.data);
      const shouldSkipZoom = callbackResult === true;

      if (shouldSkipZoom) {
        event.stopPropagation();
        return;
      }

      if (focus !== d) {
        zoom(event as unknown as MouseEvent, d);
        event.stopPropagation();
      }
    });

    // mount
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(svg.node() as SVGSVGElement);

    // cleanup
    return () => {
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
  ]);

  return (
    <div className="flex w-full items-center justify-center">
      <div ref={containerRef} />
    </div>
  );
};

export default CirclePackChart;
