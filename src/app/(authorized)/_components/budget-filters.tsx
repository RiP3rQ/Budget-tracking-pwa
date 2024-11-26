"use client";

import { AccountFilter } from "@/app/(dashboard)/budget/_components/account-filter";
import { DateFilter } from "@/app/(dashboard)/budget/_components/date-filter";

export const BudgetFilters = () => {
  return (
    <div
      className={
        "flex flex-col lg:flex-row items-center gap-y-2 lg:gap-y-0 lg:gap-x-2"
      }
    >
      <AccountFilter />
      <DateFilter />
    </div>
  );
};
