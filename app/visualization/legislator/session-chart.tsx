import CirclePackChart from "../circle-pack-chart";
import type { NodeDatum } from "../helpers";

const getBorderBottomClass = (index: number, totalItems: number) => {
  return totalItems > 1 && index < totalItems - 1
    ? "border-b border-gray-200"
    : "";
};

type SessionChartProps = {
  data: NodeDatum[]; // 每個元素代表一個年度 session
  yearToCommitteeMap: Map<string, string>;
};

const SessionChart = ({ data, yearToCommitteeMap }: SessionChartProps) => {
  // 如果沒有資料，顯示提示訊息
  const CIRCLE_PACK_CHART_PADDING = 50;
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <p className="text-gray-500">目前無提案資料</p>
      </div>
    );
  }

  return (
    <>
      {data.map((session, index) => (
        <div
          key={session.id}
          className={`mb-2 flex w-full max-w-[1000px] flex-col items-start justify-center ${getBorderBottomClass(
            index,
            data.length
          )}`}
        >
          <div className="flex flex-col items-start justify-center">
            <p>{session.name}</p>
            <p>{yearToCommitteeMap.get(session.name) ?? "委員會"}</p>
          </div>
          <div className="md:mx-auto">
            <CirclePackChart
              data={{
                id: session.id,
                name: "root",
                children: session.children,
              }}
              padding={CIRCLE_PACK_CHART_PADDING}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default SessionChart;
