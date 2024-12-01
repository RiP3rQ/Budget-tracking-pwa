"use client";

import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useDateRangeFilterState } from "@/hooks/use-date-range-filter-state";
import { DateRangePicker } from "@/components/ui/date-range-picker";

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

  const applyDateFilters = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    if (!values.range?.from || !values.range?.to) {
      toast.error("Błąd: Nie wybrano zakresu dat");
      return;
    }

    setDateFrom(values.range.from);
    setDateTo(values.range.to);
  };

  // Convert ISO strings to Date objects for the Calendar component
  const fromDate = dateFrom ? new Date(dateFrom) : undefined;
  const toDate = dateTo ? new Date(dateTo) : undefined;

  return (
    <DateRangePicker
      onUpdate={applyDateFilters}
      initialDateFrom={fromDate}
      initialDateTo={toDate}
      resetDateFrom={new Date(DEFAULT_DATE_FROM)}
      resetDateTo={new Date(DEFAULT_DATE_TO)}
      align="start"
      locale="pl-PL"
      showCompare={false}
    />
  );
};
