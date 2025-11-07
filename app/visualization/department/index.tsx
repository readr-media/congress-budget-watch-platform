import { useMemo } from "react";
import type { GetVisualizationProposalsQuery } from "~/graphql/graphql";
import { transformToCategorizedData, type NodeDatum } from "../helpers";
import CirclePackChart, {
  type CirclePackPadding,
} from "../circle-pack-chart";

type DepartmentVisualizationProps = {
  data: GetVisualizationProposalsQuery;
  width?: number;
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
  onNodeClick,
  mode,
  transformedData,
  padding,
}: DepartmentVisualizationProps) => {
  const categorizedData = useMemo(
    () => transformedData ?? transformToCategorizedData(data, mode),
    [data, mode, transformedData],
  );

  const paddingValue = useMemo(
    () => padding ?? DEFAULT_PADDING,
    [padding],
  );

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
          <p className="text-xl">{category}</p>
          {chartData.children && chartData.children.length > 0 ? (
            <CirclePackChart
              data={chartData}
              width={width}
              height={width}
              padding={paddingValue}
              onNodeClick={onNodeClick}
            />
          ) : (
            <div
              className="flex h-48 items-center justify-center text-gray-400"
              style={{ width }}
            >
              此類別無提案金額資料
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
