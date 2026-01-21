import * as Dialog from "@radix-ui/react-dialog";
import { NavLink } from "react-router";
import { useRef, type RefObject } from "react";
import { useOnClickOutside, useToggle } from "usehooks-ts";
import React from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { VoteButtons } from "~/components/VoteButtons";
import { useProposalVoteCounts } from "~/stores/vote.store";
import { getResultDisplay } from "~/budget-detail/helpers";

const DESKTOP_GRID_COLS =
  "grid-cols-[1.2fr_1fr_1.5fr_1fr_1fr_1fr_2.5fr_1.5fr_1.5fr_1.3fr_1.2fr]";

export type BudgetTableData = {
  id: string;
  sequence: number;
  department: string;
  date: string;
  stage: string;
  proposer: string;
  proposalType: string;
  proposalResult: string;
  proposalContent: string;
  originalAmount?: string | null;
  reducedAmount?: string | null;
  tags?: string | null;
  status: string; // Assuming 'committeed' is a valid status
  committeedDate?: string | null; // This can be optional or string
  totalReacts: number;
  unfreezeStatusLabel?: string | null;
  // Add reacts to the table data
  react_angry?: number | null;
  react_disappoint?: number | null;
  react_good?: number | null;
  react_whatever?: number | null;
};

type BudgetTableProps = {
  data: BudgetTableData[];
  className?: string;
  isDesktop?: boolean;
};

const DesktopTableHeader = () => {
  const headerCellClasses =
    "flex items-center justify-center border-y-2 text-sm text-center md:px-2 md:py-3.5 lg:px-4 lg:py-7";

  return (
    <div
      className={`grid-rows-auto grid ${DESKTOP_GRID_COLS} bg-gray-100 font-bold`}
    >
      <div className={headerCellClasses}>編號</div>
      <div className={headerCellClasses}>部會</div>
      <div className={headerCellClasses}>
        審議日期 <br />
        （階段）
      </div>
      <div className={headerCellClasses}>提案人</div>
      <div className={`${headerCellClasses} flex-col`}>
        提案 <br />
        <span className="text-[#3e51ff] text-[10px] font-medium leading-tight">
          （解凍最新狀態）
        </span>
      </div>
      <div className={headerCellClasses}>審議結果</div>
      <div className={headerCellClasses}>提案內容</div>
      <div className={headerCellClasses}>
        減列/
        <br /> 凍結金額
      </div>
      <div className={headerCellClasses}>預算金額</div>
      <div className={headerCellClasses}>關心數</div>
      <div className={headerCellClasses}>我關心這個</div>
    </div>
  );
};

const TableRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col md:w-20 md:max-w-[138px]">
    <p className="flex w-full items-center justify-center border-y-2 bg-white font-bold md:h-[76px] md:border-y-2 md:bg-neutral-400">
      {label}
    </p>
    <div className="flex w-full items-center justify-start border-b-2 py-3 md:border-b-0">
      {children}
    </div>
  </div>
);

const ProposalContent = ({ content }: { content: string; itemId: string }) => (
  <div className="w-full py-3">
    <div className="relative flex items-start gap-2">
      <p className="mb-5 line-clamp-8 flex-1">{content}</p>
      <div className="absolute right-0 bottom-0">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="shrink-0 text-blue-600 hover:underline"
            >
              [更多]
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[80vh] w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-4 shadow-lg">
              <VisuallyHidden.Root>
                <Dialog.Title>提案內容</Dialog.Title>
              </VisuallyHidden.Root>
              <div className="leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
              <div className="mt-4 flex justify-center">
                <Dialog.Close asChild>
                  <button className="bg-brand-primary rounded px-3 py-1 text-white">
                    關閉
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  </div>
);

const BudgetTableRow = ({ item }: { item: BudgetTableData }) => {
  const liveCounts = useProposalVoteCounts(item.id);
  const displayReacts = liveCounts
    ? (liveCounts.react_good ?? 0) +
      (liveCounts.react_angry ?? 0) +
      (liveCounts.react_disappoint ?? 0) +
      (liveCounts.react_whatever ?? 0)
    : (item.totalReacts ?? 0);
  return (
    <div className="flex flex-col md:w-full md:flex-row">
      <div className="md:bg-surface-subtle flex items-center justify-start gap-x-2 border-y-2 bg-neutral-400 py-2 md:min-w-16 md:flex-col md:border-y-0 md:py-0">
        <span className="flex items-center font-bold md:flex md:h-[76px] md:border-y-2 md:bg-neutral-400 md:px-4 md:py-5">
          編號
        </span>
        <span className="md:text-md md:bg-surface-subtle font-bold text-[#d18081] md:mt-4">
          {item.id}
        </span>
        <NavLink
          to={`/budget/${item.id}`}
          className="text-brand-primary md:bg-surface-subtle ml-2 text-xs md:ml-0"
        >
          [查看單頁]
        </NavLink>
      </div>
      <TableRow label="部會">{item.department}</TableRow>
      <TableRow label="審議日期（階段）">{`${item.date} (${item.stage})`}</TableRow>
      <TableRow label="提案人（連署）">
        {item.proposer.split(" ").map((name, index, arr) => (
          <React.Fragment key={index}>
            {name}
            {index < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </TableRow>

      <div className="grid grid-cols-[1fr_1fr_2fr_2fr] grid-rows-[76px] justify-items-center text-center">
        <p className="flex size-full flex-col items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-neutral-400 md:p-0">
          提案
          <span className="text-[#3e51ff] text-[10px] font-medium leading-tight">
            （解凍最新狀態）
          </span>
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:w-[120px] md:border-y-2 md:bg-neutral-400 md:p-0">
          審議結果
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-neutral-400 md:p-0">
          預算金額
        </p>
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-neutral-400 md:p-0">
          減列/凍結金額
        </p>
        <p className="w-full py-2">{item.proposalType}</p>
        {item.unfreezeStatusLabel && (
          <p className="w-full pb-4 text-xs font-semibold text-[#3e51ff]">
            {item.unfreezeStatusLabel}
          </p>
        )}
        <p className="w-full py-2">{getResultDisplay(item.proposalResult)}</p>
        <p className="w-full py-2">{item.originalAmount}</p>
        <div className="w-full py-2">
          {item.reducedAmount?.split(" / ").map((line, index, arr) => (
            <React.Fragment key={index}>
              {line}
              {arr.length > 1 && index === 0 && " /"}
              {arr.length > 1 && index === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <TableRow label="提案內容">
        <ProposalContent content={item.proposalContent} itemId={item.id} />
      </TableRow>
      <TableRow label="關心數">{displayReacts}</TableRow>
      <TableRow label="我要關心這個">
        <div className="mb-9 flex w-full flex-col items-center justify-center gap-y-4">
          <div className="flex w-full items-center justify-center rounded-3xl border-2 bg-white">
            <VoteButtons
              proposal={{
                id: item.id,
                react_angry: item.react_angry,
                react_disappoint: item.react_disappoint,
                react_good: item.react_good,
                react_whatever: item.react_whatever,
              }}
              singleButtonStyle="max-w-[72px] text-[9px]"
              shouldShowCount={false}
            />
          </div>
        </div>
      </TableRow>
    </div>
  );
};

const DesktopTableRow = ({ item }: { item: BudgetTableData }) => {
  const liveCounts = useProposalVoteCounts(item.id);
  const itemCountsFromFields =
    (item.react_good ?? 0) +
    (item.react_angry ?? 0) +
    (item.react_disappoint ?? 0) +
    (item.react_whatever ?? 0);
  const displayReacts = liveCounts
    ? (liveCounts.react_good ?? 0) +
      (liveCounts.react_angry ?? 0) +
      (liveCounts.react_disappoint ?? 0) +
      (liveCounts.react_whatever ?? 0)
    : itemCountsFromFields || (item.totalReacts ?? 0);
  const voteMenuRef = useRef<HTMLDivElement>(null);
  const [, , setVoteMenuOpen] = useToggle();

  const handleClickOutsideVoteMenu = () => {
    setVoteMenuOpen(false);
  };

  useOnClickOutside(
    voteMenuRef as RefObject<HTMLElement>,
    handleClickOutsideVoteMenu
  );
  // 使用穩定的 key，避免因為反應計數更新而重新掛載 VoteButtons
  const proposalKey = item.id;

  return (
    <>
      <div className="flex flex-col items-start justify-start pt-3 text-sm">
        <NavLink
          to={`/budget/${item.id}`}
          className="text-[#d18081] hover:underline"
        >
          {item.id}
        </NavLink>
        {/* NOTE: survey why the brand-primary cannot display correctly  */}
        <NavLink to={`/budget/${item.id}`} className="text-xs text-[#3e51ff]">
          [查看單頁]
        </NavLink>
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.department}
      </div>
      <div className="flex flex-col items-start justify-start pt-3 text-sm">
        <div>{item.date}</div>
        <div className="text-gray-600">({item.stage})</div>
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.proposer.split(" ").map((name, index, arr) => (
          <React.Fragment key={index}>
            {name}
            {index < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        <div className="text-center">
          <div>{item.proposalType}</div>
          {item.unfreezeStatusLabel && (
            <div className="text-xs font-semibold text-[#3e51ff]">
              {item.unfreezeStatusLabel}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-start justify-center pt-3 text-sm">
        {item.proposalResult}
      </div>
      <div className="flex items-start justify-start pt-3 text-sm">
        <div className="relative w-full">
          <p className="line-clamp-4">{item.proposalContent}</p>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="cursor-pointer text-xs text-blue-600 hover:underline"
              >
                [更多]
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed top-1/2 left-1/2 max-h-[80vh] w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-4 shadow-lg">
                <div className="leading-relaxed whitespace-pre-wrap">
                  {item.proposalContent}
                </div>
                <div className="mt-4 flex justify-center">
                  <Dialog.Close asChild>
                    <button className="bg-brand-primary rounded px-3 py-1 text-white">
                      關閉
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        <div className="w-full py-2 text-center">
          {item.reducedAmount?.split(" / ").map((line, index, arr) => (
            <React.Fragment key={index}>
              {line}
              {arr.length > 1 && index === 0 && " /"}
              {arr.length > 1 && index === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        {item.originalAmount}
      </div>
      <div className="flex items-start justify-center pt-3 md:text-xs lg:text-sm">
        {displayReacts}
      </div>
      <div className="flex items-start justify-center pt-3">
        {/* <VoteButtons proposalId={item.id} /> */}
        <VoteButtons key={proposalKey} proposal={item} displayMode="popup" />
      </div>
    </>
  );
};

const BudgetTable = ({ data, isDesktop, className = "" }: BudgetTableProps) => {
  if (isDesktop)
    return (
      <div className={`${className} space-y-10 md:pb-10`}>
        {data.map((item) => (
          <div key={item.id}>
            <DesktopTableHeader />
            <div className={`grid ${DESKTOP_GRID_COLS}`}>
              <DesktopTableRow item={item} />
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className={`flex flex-col ${className}`}>
      {data.map((item) => (
        <BudgetTableRow key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BudgetTable;
