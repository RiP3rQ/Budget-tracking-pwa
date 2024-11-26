import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, subDays } from "date-fns";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/utils";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import qs from "query-string";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId") ?? "all";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (date: DateRange | undefined) => {
    const query = {
      accountId,
      from: format(date?.from ?? defaultFrom, "yyyy-MM-dd"),
      to: format(date?.to ?? defaultTo, "yyyy-MM-dd"),
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
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
          <span>{formatDateRange(paramState)}</span>
          <ChevronDown className={"size-4 ml-2 opacity-50"} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"lg:w-auto w-full p-0"} align={"start"}>
        <Calendar
          disabled={false}
          initialFocus
          mode={"range"}
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
        <div className={"p-4 w-full flex items-center gap-x-2"}>
          <PopoverClose asChild>
            <Button
              disabled={!date?.from || !date?.to}
              variant={"outline"}
              onClick={onReset}
              className={"w-full"}
            >
              Reset
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              disabled={!date?.from || !date?.to}
              onClick={() => pushToUrl(date)}
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
