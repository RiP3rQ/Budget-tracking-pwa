import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-header";

import { Actions } from "@/actions/budget/transactions/table/actions";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { AccountColumn } from "@/components/table/accounts/account-column";
import { CategoryColumn } from "@/components/table/transactions/category-column";
import { FullSelectTransaction } from "@/db/schema";
import { formatCurrency } from "@/lib/currencies";

export const columns: ColumnDef<FullSelectTransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const date = moment(row.original.date).format("DD.MM.YYYY");
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategoria" />
    ),
    cell: ({ row }) => {
      return (
        <CategoryColumn id={row.original.id} category={row.original.category} />
      );
    },
  },
  {
    accessorKey: "payee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Odbiorca" />
    ),
    cell: ({ row }) => {
      return <div>{row.original.payee}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kwota" />
    ),
    cell: ({ row }) => {
      const amount = Number(row.original.amount);
      return (
        <Badge
          variant={amount > 0 ? "income" : "expense"}
          className={"text-xs font-medium px-3.5 py-2.5"}
        >
          {formatCurrency(amount)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Konto" />
    ),
    cell: ({ row }) => {
      return <AccountColumn account={row.original.account} />;
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Akcje" />
    ),
    cell: ({ row }) => <Actions row={row} />,
  },
];
