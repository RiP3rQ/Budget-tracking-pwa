"use client";

import { subDays } from "date-fns";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { formatDateRange } from "@/lib/dates";
import { useDateRangeFilterState } from "@/hooks/use-date-range-filter-state";

const DATE_FROM_STORAGE_KEY = "selectedDateFrom";
const DATE_TO_STORAGE_KEY = "selectedDateTo";
const DEFAULT_DATE_TO = new Date();
const DEFAULT_DATE_FROM = subDays(new Date(), 30);

export const DateFilter = () => {
  const [dateFrom, setDateFrom] = useDateRangeFilterState({
    queryKey: "dateFrom",
    storageKey: DATE_FROM_STORAGE_KEY,
    defaultValue: DEFAULT_DATE_FROM,
  });

  const [dateTo, setDateTo] = useDateRangeFilterState({
    queryKey: "dateTo",
    storageKey: DATE_TO_STORAGE_KEY,
    defaultValue: DEFAULT_DATE_TO,
  });

  const applyDateFilters = (date: DateRange | undefined) => {
    if (!date?.from || !date?.to) {
      toast.error("Błąd: Nie wybrano zakresu dat");
      return;
    }

    setDateFrom(date.from);
    setDateTo(date.to);
  };

  const onReset = () => {
    setDateFrom(DEFAULT_DATE_FROM);
    setDateTo(DEFAULT_DATE_TO);
  };

  // Convert ISO strings to Date objects for the Calendar component
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={[
            "lg:w-auto w-full h-9 rounded-md px-3 font-normal",
            "bg-white/10 hover:bg-white/20 hover:text-white border-none",
            "focus:ring-transparent focus:ring-offset-0 outline-none text-white",
            "focus:bg-white/30 transition",
          ].join(" ")}
        >
          <span>
            {formatDateRange({
              from: fromDate,
              to: toDate,
            })}
          </span>
          <ChevronDown className="size-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={toDate}
          selected={{
            from: fromDate,
            to: toDate,
          }}
          onSelect={applyDateFilters}
          numberOfMonths={2}
        />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              disabled={!fromDate || !toDate}
              variant="outline"
              onClick={onReset}
              className="w-full"
            >
              Reset
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
