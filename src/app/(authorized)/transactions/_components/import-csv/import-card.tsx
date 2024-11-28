import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDateForDb } from "@/lib/dates";
import { ImportTable } from "@/app/(authorized)/transactions/_components/import-csv/import-table";

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

interface SelectedColumnState {
  [key: string]: string | null;
}

export const REQUIRED_COLUMNS = ["date", "amount", "payee"];

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {},
  );
  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, _index) => {
        const columnIndex = getColumnIndex(`column_${_index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, cellIndex) => {
            const columnIndex = getColumnIndex(`column_${cellIndex}`);
            const column = selectedColumns[`column_${columnIndex}`];
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });

          return transformedRow.every((cell) => cell === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    const formattedFinalData = arrayOfData.map((item) => {
      const formattedDate = formatDateForDb(item.date);
      return {
        ...item,
        amount: parseFloat(item.amount),
        date: new Date(formattedDate),
      };
    });

    onSubmit(formattedFinalData);
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  return (
    <Card className={"border-none drop-shadow-sm"}>
      <CardHeader
        className={"gap-y-2 lg:flex-row lg:items-center lg:justify-between"}
      >
        <CardTitle>Import transakcji</CardTitle>
        <div className={"flex items-center gap-x-1"}>
          <Button onClick={onCancel} variant="default" size={"sm"}>
            Anuluj
          </Button>
          <Button
            onClick={handleContinue}
            variant="default"
            size={"sm"}
            disabled={progress < REQUIRED_COLUMNS.length}
          >
            Zatwierdź ({progress}/{REQUIRED_COLUMNS.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ImportTable
          headers={headers}
          body={body}
          selectedColumns={selectedColumns}
          onTableHeadSelectChange={onTableHeadSelectChange}
        />
      </CardContent>
    </Card>
  );
};
