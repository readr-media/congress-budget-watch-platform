import Image from "~/components/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export type SummaryPanelSummary = {
  formattedReductionAmount: string;
  formattedFreezeAmount: string;
  reductionCount: number;
  freezeCount: number;
  mainResolutionCount: number;
};

type SummaryPanelProps = {
  summary: SummaryPanelSummary;
};

const tooltipContentMap = {
  reduction:
    "刪減金額為立委通過的預算提案單加總，若預算科目相同、子項目不同時無法處理（此為該部會內部資料），最終刪減狀況請以該部會法定預算為主。",
  freeze:
    "凍結金額為立委通過的預算提案單加總，若預算科目相同、子項目不同時無法處理（此為該部會內部資料），最終凍結狀況請以該部會法定預算為主。",
  mainResolution:
    "指沒有刪減、也沒有凍結金額的提案，通常是對該預算的建議。實務上，實質效力要看提案立委後續有沒有追蹤該機關實質改進狀況。",
} as const;

const TooltipIcon = ({
  tooltipContentType,
}: {
  tooltipContentType: keyof typeof tooltipContentMap;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-1 inline-flex">
          <Image src="/icon/icon-explain.svg" alt="說明" className="h-4 w-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="bg-black text-white max-w-40 break-words">
        {tooltipContentMap[tooltipContentType]}
      </TooltipContent>
    </Tooltip>
  );
};

const SummaryPanel = ({ summary }: SummaryPanelProps) => (
  <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-2 p-2.5">
    <p>
      總共刪減
      <span className="text-brand-accent">
        {summary.formattedReductionAmount}
      </span>
      （<span className="text-brand-accent">{summary.reductionCount}</span>
      個提案）
      <TooltipIcon tooltipContentType="reduction" />
    </p>
    <p>
      凍結
      <span className="text-brand-accent">{summary.formattedFreezeAmount}</span>
      （<span className="text-brand-accent">{summary.freezeCount}</span>
      個提案）
      <TooltipIcon tooltipContentType="freeze" />
    </p>
    <p>
      主決議提案數：
      <span className="text-brand-accent">{summary.mainResolutionCount}</span>個
      <TooltipIcon tooltipContentType="mainResolution" />
    </p>
  </div>
);

export default SummaryPanel;
