import { useMemo } from "react";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";
import {
  formatAmountWithUnit,
  GROUP_LABELS,
  transformToCategorizedData,
  type NodeDatum,
} from "../helpers";
import CirclePackChart, { type CirclePackPadding } from "../circle-pack-chart";

type DepartmentVisualizationProps = {
  data: GetVisualizationProposalsQuery;
  width?: number;
  height?: number;
  onNodeClick: (node: NodeDatum) => void;
  mode: "amount" | "count";
  transformedData?: Record<string, NodeDatum>;
  padding?: CirclePackPadding;
  selectedDepartmentCategorizedData?: Record<string, NodeDatum> | null;
  selectedDepartmentTitle?: string | null;
  showSelectedDepartmentChart?: boolean;
};

const DEFAULT_PADDING: CirclePackPadding = (node) => {
  if (!node.children?.length) {
    return 18;
  }
  if (node.depth === 0) {
    return 26;
  }
  return 22;
};

const HIGHLIGHT_VALUE_EXPONENT = 0.45;

export const DepartmentVisualization = ({
  data,
  width = 928,
  height,
  // height will default to width if not provided to preserve existing visuals
  onNodeClick,
  mode,
  transformedData,
  padding,
  selectedDepartmentCategorizedData,
  selectedDepartmentTitle,
  showSelectedDepartmentChart,
}: DepartmentVisualizationProps) => {
  const categorizedData = useMemo(
    () => transformedData ?? transformToCategorizedData(data, mode),
    [data, mode, transformedData]
  );

  const paddingValue = useMemo(() => padding ?? DEFAULT_PADDING, [padding]);

  const mergedSelectedDepartmentChildren = useMemo<NodeDatum[] | null>(() => {
    if (!selectedDepartmentCategorizedData) return null;
    const children = Object.values(selectedDepartmentCategorizedData).flatMap(
      (node) => node.children ?? []
    );
    if (!children.length) return null;

    type MergedEntry = {
      totalAmount: number;
      node: NodeDatum;
    };

    const merged = new Map<string, MergedEntry>();
    children.forEach((child) => {
      const key = [
        child.proposerId ?? child.name ?? "unknown",
        child.proposalType ?? "unknown-type",
      ].join("-");

      const displayName =
        child.name?.split("\n")[0] ?? child.name ?? "無名提案者";
      const circleValue = child.value ?? 0;
      const amount =
        circleValue > 0
          ? Math.pow(circleValue, 1 / HIGHLIGHT_VALUE_EXPONENT)
          : 0;
      const categoryLabel =
        GROUP_LABELS[child.proposalType as keyof typeof GROUP_LABELS] ?? "";

      const existing = merged.get(key);
      if (existing) {
        const nextAmount = existing.totalAmount + amount;
        merged.set(key, {
          totalAmount: nextAmount,
          node: {
            ...existing.node,
            name: `${displayName}\n${categoryLabel}\n${formatAmountWithUnit(
              nextAmount
            )}`,
            value: Math.pow(nextAmount, HIGHLIGHT_VALUE_EXPONENT),
          },
        });
      } else {
        merged.set(key, {
          totalAmount: amount,
          node: {
            ...child,
            id: `merged-${key}`,
            name: `${displayName}\n${categoryLabel}\n${formatAmountWithUnit(
              amount
            )}`,
            value: Math.pow(amount, HIGHLIGHT_VALUE_EXPONENT),
          },
        });
      }
    });

    return Array.from(merged.values()).map((entry) => entry.node);
  }, [selectedDepartmentCategorizedData]);

  const highlightedChartData = useMemo<NodeDatum | null>(() => {
    if (!mergedSelectedDepartmentChildren || !showSelectedDepartmentChart) {
      return null;
    }
    return {
      id: `selected-department-${selectedDepartmentTitle ?? "selected"}`,
      name: selectedDepartmentTitle ?? "目前部會",
      children: mergedSelectedDepartmentChildren,
    };
  }, [
    mergedSelectedDepartmentChildren,
    selectedDepartmentTitle,
    showSelectedDepartmentChart,
  ]);

  const categories = Object.keys(categorizedData);
  const highlightChartData = highlightedChartData;

  if (categories.length === 0) {
    return (
      <div
        className="flex h-96 items-center justify-center text-gray-500"
        style={{ width }}
      >
        無符合資料
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      {highlightChartData && (
        <div
          key="selected-department-highlight"
          className="flex w-full flex-col items-center justify-center gap-y-5 font-bold"
        >
          <p className="text-xl">
            看全部
          </p>
              <CirclePackChart
                data={highlightChartData}
            width={width}
            height={height ?? width}
            padding={paddingValue}
            onNodeClick={onNodeClick}
          />
        </div>
      )}
      {Object.entries(categorizedData).map(([category, chartData]) => (
        <div
          key={category}
          className="flex w-full flex-col items-center justify-center gap-y-5 font-bold"
        >
          {chartData.children && chartData.children.length > 0 && (
            <>
              <p className="text-xl">{category}</p>
              <CirclePackChart
                data={chartData}
                width={width}
                height={height ?? width}
                padding={paddingValue}
                onNodeClick={onNodeClick}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
