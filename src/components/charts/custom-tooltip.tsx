import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { pl } from "date-fns/locale";

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;
  const income = payload[0].value;
  const expense = payload[1].value;

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
            {formatCurrency(income)}
          </p>
        </div>
        {/*EXPENSES */}
        <div className={"flex items-center justify-between gap-x-4"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"size-1.5 bg-rose-500 rounded-full"} />
            <p className={"text-sm text-muted-foreground"}>Wydatki</p>
          </div>
          <p className={"text-sm text-muted-foreground font-medium text-right"}>
            {formatCurrency(expense)}
          </p>
        </div>
      </div>
    </div>
  );
};
