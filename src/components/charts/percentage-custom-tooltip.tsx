import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/currencies";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomPercentageTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Payload<ValueType, NameType>[];
}) => {
  if (!active) return null;

  const name = payload?.[0].payload.name;
  const value = payload?.[0].value;

  return (
    <div className={"rounded-sm bg-white shadow-sm border overflow-hidden"}>
      <div className={"text-sm p-2 px-3 bg-muted text-muted-foreground"}>
        {name}
      </div>
      <Separator />
      <div className={"p-2 px-3 space-y-1"}>
        {/*EXPENSES */}
        <div className={"flex items-center justify-between gap-x-4"}>
          <div className={"flex items-center gap-x-2"}>
            <div className={"size-1.5 bg-rose-500 rounded-full"} />
            <p className={"text-sm text-muted-foreground"}>Wydatki</p>
          </div>
          <p className={"text-sm text-muted-foreground font-medium text-right"}>
            {formatCurrency(Number(value) * -1)}
          </p>
        </div>
      </div>
    </div>
  );
};
