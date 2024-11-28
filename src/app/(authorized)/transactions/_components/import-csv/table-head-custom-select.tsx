import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { REQUIRED_COLUMNS } from "@/app/(authorized)/transactions/_components/import-csv/import-card";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = [
  {
    label: "Notatka",
    value: "note",
  },
  {
    label: "Data",
    value: "date",
  },
  {
    label: "Kwota",
    value: "amount",
  },
  {
    label: "Odbiorca",
    value: "payee",
  },
];

export const TableHeadCustomSelect = ({
  columnIndex,
  selectedColumns,
  onChange,
}: Props) => {
  const currentSelection = selectedColumns[`column_${columnIndex}`];

  return (
    <Select
      value={currentSelection || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none" +
            "border-none bg-transparent capitalize",
          currentSelection && "text-blue-500",
        )}
      >
        <SelectValue placeholder={"Pomiń"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"skip"}>Pomiń</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.values(selectedColumns).includes(option.value) &&
            selectedColumns[`column_${columnIndex}`] !== option.value;
          return (
            <SelectItem
              key={index}
              value={option.value}
              disabled={disabled}
              className={"capitalize"}
            >
              {option.label}
              {REQUIRED_COLUMNS.includes(option.value) && (
                <span className={"text-red-500"}>*</span>
              )}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
