import { useMediaQuery } from "usehooks-ts";
import CirclePackChart from "../circle-pack-chart";
import type { NodeDatum } from "../helpers";

const getBorderBottomClass = (index: number, totalItems: number) => {
  return totalItems > 1 && index < totalItems - 1
    ? "border-b border-gray-200"
    : "";
};

type SessionChartProps = {
  data: NodeDatum[];
  presenterDescription?: string | null;
  yearToCommitteeMap: Map<string, string>;
  onNodeClick?: (node: NodeDatum) => void | boolean;
};

const SessionChart = ({
  data,
  presenterDescription = "",
  yearToCommitteeMap,
  onNodeClick,
}: SessionChartProps) => {
  const CIRCLE_PACK_CHART_PADDING = 50;
  const matchTablet = useMediaQuery("(min-width: 768px)");
  const matchScreenS = useMediaQuery("(min-width: 1024px)");
  const matchScreenM = useMediaQuery("(min-width: 1440px)");
  const matchScreenL = useMediaQuery("(min-width: 1920px)");
  const circlePackChartWidth = () => {
    if (matchScreenL) return 1800;
    if (matchScreenM) return 1400;
    if (matchScreenS) return 1000;
    if (matchTablet) return 720;
    return 720;
  };
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <p className="text-gray-500">目前無提案資料</p>
      </div>
    );
  }

  const chartWidthValue = circlePackChartWidth();
  const chartContainerStyle = {
    maxWidth: `${chartWidthValue}px`,
  };

  return (
    <>
      {data.map((session, index) => (
        <div
          key={session.id}
          className={`mb-2 flex w-full flex-col items-start justify-center ${getBorderBottomClass(
            index,
            data.length
          )} mx-auto`}
          style={chartContainerStyle}
        >
          <div className="flex w-full flex-col items-start justify-center">
            <p>{session.name}</p>
            <p>{yearToCommitteeMap.get(session.name) ?? "委員會"}</p>
            {presenterDescription ? (
              <div className="flex w-full flex-col items-start justify-center mb-5 lg:mb-8">
                <p className="text-sm leading-relaxed text-black/80">
                  {presenterDescription}
                </p>
              </div>
            ) : null}
          </div>
          <div className="w-full md:mx-auto">
            <CirclePackChart
              data={{
                id: session.id,
                name: "root",
                children: session.children,
              }}
              width={chartWidthValue}
              padding={CIRCLE_PACK_CHART_PADDING}
              onNodeClick={onNodeClick}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SessionChart;
