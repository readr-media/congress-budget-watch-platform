import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ShareButton } from "@readr-media/share-button";
import { NavLink, useLocation } from "react-router";
import Image from "./image";
import { useOnClickOutside, useToggle } from "usehooks-ts";

const BudgetHeader = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [hamburgerShow, toggleHamburger, setHamburgerShowValue] = useToggle();
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const currentYear = new Date().getFullYear();
  const republicYear = currentYear - 1911;

  const NAV_ITEMS = [
    {
      label: "歷年預算",
      to: "/all-budgets",
      // Active when pathname matches AND no year param
      isActive: (loc: { pathname: string; search: string }) =>
        loc.pathname === "/all-budgets" && !loc.search.includes("year="),
    },
    {
      label: "最新年度預算",
      to: `/all-budgets?year=${republicYear}`,
      // Active when pathname matches AND year param matches
      isActive: (loc: { pathname: string; search: string }) =>
        loc.pathname === "/all-budgets" &&
        loc.search.includes(`year=${republicYear}`),
    },
    {
      label: "視覺化專區",
      to: "/visualization",
    },
    {
      label: "協作區",
      to: "/collaboration",
    },
  ];

  const handleClickOutsideHamburger = () => {
    setHamburgerShowValue(false);
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useOnClickOutside(
    hamburgerRef as RefObject<HTMLElement>,
    handleClickOutsideHamburger
  );
  if (hamburgerShow)
    return (
      <header className="bg-brand-primary min-h-15 w-full" ref={hamburgerRef}>
        <ul className="flex w-full justify-center gap-x-1 py-5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isActive
              ? item.isActive(location)
              : location.pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setHamburgerShowValue(false)}
                  className={`rounded-lg border px-1.5 ${
                    isActive
                      ? "border-[#E9808E] text-[#E9808E]"
                      : "border-[#B3B3B3] text-white"
                  }`}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </header>
    );

  return (
    <div className="border-t-brand-primary sticky flex items-center justify-between border-t-12 px-3 pt-2">
      <div className="flex items-center gap-x-4">
        <NavLink to="/">
          <Image
            src="/image/readr-header.svg"
            alt="Readr logo"
            className="h-[34px] w-[206px]"
          />
        </NavLink>
        <ul className="hidden items-center gap-x-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isActive
              ? item.isActive(location)
              : location.pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`block rounded-lg border px-5 py-1 md:px-2 lg:px-5 ${
                    isActive
                      ? "border-[#E9808E] bg-white text-[#E9808E]"
                      : "border-[#B3B3B3] bg-[#E3E3E3] text-[#828282]"
                  }`}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex h-10 w-[134px] items-center justify-end gap-x-3.5">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="hidden cursor-pointer pt-2 text-left underline md:block"
            >
              製作團隊
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 text-gray-900 shadow-xl focus:outline-none">
              <Dialog.Title className="text-center text-xl font-bold">
                製作團隊
              </Dialog.Title>
              <div className="mt-4 space-y-2 text-base leading-relaxed">
                <p>記者：李又如</p>
                <p>設計：曾立宇</p>
                <p>工程：林祐哲、簡信昌、李又如、李文瀚、鄧宇哲、陳柏維</p>
                <p>產品經理：羅偉力</p>
                <p>資料處理：李又如、劉怡馨、陳珮瑜、徐湘芸</p>
                <p>資料合作：歐噴有限公司</p>
              </div>
              <Dialog.Close asChild>
                <button className="text-brand-primary border-brand-primary hover:bg-brand-primary focus-visible:ring-brand-primary mt-6 flex w-full items-center justify-center rounded-full border px-4 py-2 font-semibold hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
                  關閉
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        {isMounted ? (
          <ShareButton
            className="share-button-header max-h-[21px] w-full"
            direction="horizon"
            pathColor="#1C1C1C"
          />
        ) : (
          <div className="share-button-header flex h-full w-full items-center justify-end gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className="inline-flex size-8 rounded-full bg-neutral-200"
              />
            ))}
          </div>
        )}
        <button onClick={toggleHamburger} className="block md:hidden">
          <Image
            src="/icon/header-hamburger.svg"
            alt="hamburger logo"
            className="w-[21px]"
          />
        </button>
      </div>
    </div>
  );
};

export default BudgetHeader;
