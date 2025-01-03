import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { pl } from "date-fns/locale";
import { formatCurrency } from "@/lib/currencies";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Payload<ValueType, NameType>[];
}) => {
  if (!active) return null;

  const date = payload?.[0].payload.date;
  const income = payload?.find((entry) => entry.name === "income")?.payload
    .income;
  const expense = payload?.find((entry) => entry.name === "expense")?.payload
    .expense;

  return (
    <div className={"rounded-sm bg-white shadow-sm border overflow-hidden"}>
      <div className={"text-sm p-2 px-3 bg-muted text-muted-foreground"}>
        {format(date, "dd MMM yyyy", { locale: pl })}
      </div>
      <Separator />
      <div className={"p-2 px-3 space-y-1"}>
        {/*INCOME */}
        <div className={"flex items-center justify-between gap-x-4"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"size-1.5 bg-blue-500 rounded-full"} />
            <p className={"text-sm text-muted-foreground"}>Przychód</p>
          </div>
          <p className={"text-sm text-muted-foreground font-medium text-right"}>
            {formatCurrency(income || 0)}
          </p>
        </div>
        {/*EXPENSES */}
        <div className={"flex items-center justify-between gap-x-4"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"size-1.5 bg-rose-500 rounded-full"} />
            <p className={"text-sm text-muted-foreground"}>Wydatki</p>
          </div>
          <p className={"text-sm text-muted-foreground font-medium text-right"}>
            {formatCurrency(expense || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
