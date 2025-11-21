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
                      : "text-white border-[#B3B3B3]"
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
      <NavLink to="/">
        <Image
          src="/image/readr-header.svg"
          alt="Readr logo"
          className="h-[28px] w-[92px]"
        />
      </NavLink>
      <div className="flex h-10 w-[134px] items-center justify-end gap-x-3.5">
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
        <button onClick={toggleHamburger}>
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
