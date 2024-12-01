import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info, MinusCircle, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const CurrencyValueInput = ({
  value,
  onChange,
  placeholder,
  disabled = false,
}: Props) => {
  const [inputValue, setInputValue] = useState(value);
  const parsedValue = parseFloat(inputValue);
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  const onReverseValue = () => {
    if (!inputValue) return;
    const newValue = parseFloat(inputValue) * -1;
    setInputValue(newValue.toString());
    onChange(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={"relative"}>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              type={"button"}
              onClick={onReverseValue}
              className={cn(
                "bg-slate-400 hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 items-center justify-center transition flex",
                isExpense && "bg-rose-500 hover:bg-rose-600",
                isIncome && "bg-emerald-500 hover:bg-emerald-600",
              )}
            >
              {!parsedValue && <Info className={"size-3 text-white"} />}
              {isIncome && <PlusCircle className={"size-3 text-white"} />}
              {isExpense && <MinusCircle className={"size-3 text-white"} />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Używaj [+] dla przychodów oraz [-] dla wydatków.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        className={
          "pl-11 flex h-10 w-full rounded-md border border-input bg-background px-3" +
          "py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm " +
          "file:font-medium placeholder:text-muted-foreground focus-visible:outline-none" +
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
          "disabled:cursor-not-allowed disabled:opacity-50"
        }
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <Badge
        className={cn(
          "absolute top-1.5 right-1.5 bg-green-500 text-white px-2 py-1 rounded-md",
          isExpense && "bg-rose-500",
        )}
      >
        PLN
      </Badge>
      <p className={"text-xs text-muted-foreground"}>
        {isIncome ? "To będzie przychód" : isExpense ? "To będzie wydatek" : ""}
      </p>
    </div>
  );
};
