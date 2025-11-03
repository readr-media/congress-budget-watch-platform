import * as Dialog from "@radix-ui/react-dialog";
import { NavLink } from "react-router";
import { useRef, type RefObject } from "react";
import { useOnClickOutside, useToggle } from "usehooks-ts";
import React from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { VoteButtons } from "~/components/VoteButtons";

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
      <div className={headerCellClasses}>提案</div>
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
                  <button className="rounded bg-brand-primary px-3 py-1 text-white">
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
  return (
    <div className="flex flex-col md:w-full md:flex-row">
      <div className="flex items-center justify-start gap-x-2 border-y-2 bg-neutral-400 py-2 md:min-w-16 md:flex-col md:border-y-0 md:bg-surface-subtle md:py-0">
        <span className="flex items-center font-bold md:flex md:h-[76px] md:border-y-2 md:bg-neutral-400 md:px-4 md:py-5">
          編號
        </span>
        <span className="md:text-md font-bold text-warning md:mt-4 md:bg-surface-subtle">
          {item.id}
        </span>
        <NavLink
          to={`/budget/${item.id}`}
          className="ml-2 text-xs text-brand-primary md:ml-0 md:bg-surface-subtle"
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
        <p className="flex size-full items-center justify-center border-b-2 bg-white px-2 py-3.5 font-bold md:border-y-2 md:bg-neutral-400 md:p-0">
          提案
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
        <p className="w-full py-2">{item.proposalResult}</p>
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
      <TableRow label="關心數">{item.totalReacts}</TableRow>
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
            />
          </div>
        </div>
      </TableRow>
    </div>
  );
};

const DesktopTableRow = ({ item }: { item: BudgetTableData }) => {
  const voteMenuRef = useRef<HTMLDivElement>(null);
  const [, , setVoteMenuOpen] = useToggle();

  const handleClickOutsideVoteMenu = () => {
    setVoteMenuOpen(false);
  };

  useOnClickOutside(
    voteMenuRef as RefObject<HTMLElement>,
    handleClickOutsideVoteMenu
  );
  const proposalKey = `${item.id}-${item.react_good}-${item.react_angry}-${item.react_disappoint}-${item.react_whatever}`;

  return (
    <>
      <div className="flex flex-col items-start justify-start pt-3 text-sm">
        <NavLink
          to={`/budget/${item.id}`}
          className="text-warning hover:underline"
        >
          {item.id}
        </NavLink>
        <NavLink to={`/budget/${item.id}`} className="text-xs text-brand-primary">
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
        {item.proposalType}
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
                    <button className="rounded bg-brand-primary px-3 py-1 text-white">
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
        {item.totalReacts}
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
