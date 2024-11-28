import { cva, VariantProps } from "class-variance-authority";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/count-up";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/currencies";
import { formatPercentage } from "@/lib/percentages";

const boxVariants = cva("rounded-md p-3 shrink-0", {
  variants: {
    variant: {
      default: "bg-blue-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-500",
      success: "fill-emerald-500",
      danger: "fill-rose-500",
      warning: "fill-yellow-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BoxVariants = VariantProps<typeof boxVariants>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
  title: string;
  value?: number | string;
  currency?: string;
  percentageChange?: number | string;
  icon: LucideIcon;
  dateRange: string;
  isLoading?: boolean;
}

export const GridDataCard = ({
  title,
  value,
  currency,
  percentageChange,
  icon: Icon,
  dateRange,
  variant,
  isLoading,
}: DataCardProps) => {
  // TODO: REVERSE COLORS ON EXPENSES
  const percentageChangeNumber =
    typeof percentageChange === "string" ? undefined : Number(percentageChange);

  if (isLoading) return <GridDataCardLoading />;

  return (
    <Card className={"border-none drop-shadow-sm"}>
      <CardHeader
        className={"flex flex-row items-center justify-between gap-x-4"}
      >
        <div className={"space-y-2"}>
          <CardTitle className={"text-2xl line-clamp-1"}>{title}</CardTitle>
          <CardDescription className={"line-clamp-1"}>
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariants({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className={"font-bold text-2xl mb-2 line-clamp-1 break-all"}>
          {value === undefined ||
          value === null ||
          value === "" ||
          value === "Brak danych" ? (
            "Brak danych"
          ) : (
            <>
              {currency}{" "}
              <CountUp
                preserveValue
                start={0}
                end={value as number}
                decimals={2}
                decimalPlaces={2}
                formattingFn={formatCurrency}
              />
            </>
          )}
        </h1>
        {percentageChangeNumber && (
          <Badge
            className={cn("cursor-pointer", {
              "bg-emerald-500 hover:bg-emerald-700":
                percentageChangeNumber >= 0,
              "bg-rose-500 hover:bg-rose-700": percentageChangeNumber < 0,
            })}
          >
            {formatPercentage(percentageChangeNumber, { addPrefix: true })}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

const GridDataCardLoading = () => {
  return (
    <Card className={"border-none drop-shadow-sm h-[192px]"}>
      <CardHeader
        className={"flex flex-row items-center justify-between gap-x-4"}
      >
        <div className={"space-y-2"}>
          <Skeleton className={"w-24 h-6"} />
          <Skeleton className={"w-40 h-4"} />
        </div>
        <Skeleton className={"size-12"} />
      </CardHeader>
      <CardContent>
        <Skeleton className={"w-26 h-10 mb-2 shrink-0"} />
        <Skeleton className={"w-12 h-4 shrink-0"} />
      </CardContent>
    </Card>
  );
};
