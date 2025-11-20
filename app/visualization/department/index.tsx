import { useMemo } from "react";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";
import { transformToCategorizedData, type NodeDatum } from "../helpers";
import CirclePackChart, { type CirclePackPadding } from "../circle-pack-chart";

type DepartmentVisualizationProps = {
  data: GetVisualizationProposalsQuery;
  width?: number;
  height?: number;
  onNodeClick: (node: NodeDatum) => void;
  mode: "amount" | "count";
  transformedData?: Record<string, NodeDatum>;
  padding?: CirclePackPadding;
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

export const DepartmentVisualization = ({
  data,
  width = 928,
  height,
  // height will default to width if not provided to preserve existing visuals
  onNodeClick,
  mode,
  transformedData,
  padding,
}: DepartmentVisualizationProps) => {
  const categorizedData = useMemo(
    () => transformedData ?? transformToCategorizedData(data, mode),
    [data, mode, transformedData]
  );

  const paddingValue = useMemo(() => padding ?? DEFAULT_PADDING, [padding]);

  const categories = Object.keys(categorizedData);
  console.log({ categories });

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
