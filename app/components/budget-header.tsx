import { useEffect, useState } from "react";
import { ShareButton } from "@readr-media/share-button";
import { NavLink } from "react-router";
import Image from "./image";

const BudgetHeader = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="sticky flex items-center justify-between border-t-12 border-t-brand-primary px-3 pt-2">
      <NavLink to="/">
        <Image
          src="/image/readr-header.svg"
          alt="Readr logo"
          className="h-[28px] w-[92px]"
        />
      </NavLink>
      <div className="flex h-10 w-[134px] items-center justify-end">
        {isMounted ? (
          <ShareButton
            className="share-button-header h-full w-full"
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
      </div>
    </div>
  );
};

export default BudgetHeader;
