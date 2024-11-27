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
import { parseAsIsoDate, useQueryState } from "nuqs";
import { toast } from "sonner";
import { formatDateRange } from "@/lib/dates";

export const DateFilter = () => {
  const [dateFrom, setDateFrom] = useQueryState(
    "from",
    parseAsIsoDate
      .withOptions({
        shallow: true,
      })
      .withDefault(new Date()),
  );
  const [dateTo, setDateTo] = useQueryState(
    "to",
    parseAsIsoDate
      .withOptions({
        shallow: true,
      })
      .withDefault(subDays(new Date(), 30)),
  );

  const applyDateFilters = (date: DateRange | undefined) => {
    if (!date?.from || !date?.to) {
      toast.error("Błąd: Nie wybrano zakresu dat");
      return;
    }

    setDateFrom(date.from);
    setDateTo(date.to);
  };

  const onReset = () => {
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size={"sm"}
          variant={"outline"}
          className={
            "lg:w-auto w-full h-9 rounded-md px-3 font-normal" +
            "bg-white/10 hover:bg-white/20 hover:text-white border-none" +
            "focus:ring-transparent focus:ring-offset-0 outline-none text-white" +
            "focus:bg-white/30 transition"
          }
        >
          <span>
            {formatDateRange({
              from: dateFrom,
              to: dateTo,
            })}
          </span>
          <ChevronDown className={"size-4 ml-2 opacity-50"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"lg:w-auto w-full p-0"} align={"start"}>
        <Calendar
          disabled={false}
          initialFocus
          mode={"range"}
          defaultMonth={dateTo}
          selected={{
            from: dateFrom,
            to: dateTo,
          }}
          onSelect={applyDateFilters}
          numberOfMonths={2}
        />
        <div className={"p-4 w-full flex items-center gap-x-2"}>
          <PopoverClose asChild>
            <Button
              disabled={!dateFrom || !dateTo}
              variant={"outline"}
              onClick={onReset}
              className={"w-full"}
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              disabled={!dateFrom || !dateTo}
              onClick={() => applyDateFilters({ from: dateFrom, to: dateTo })}
              className={"w-full"}
            >
              Zastosuj
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
