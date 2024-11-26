"use client";

import { NewAccountSheet } from "@/app/(dashboard)/budget/accounts/_components/new-account-sheet";
import { useMountedState } from "react-use";
import { EditAccountSheet } from "@/app/(dashboard)/budget/accounts/_components/edit-account-sheet";
import { NewCategorySheet } from "@/app/(dashboard)/budget/categories/_components/new-category-sheet";
import { EditCategorySheet } from "@/app/(dashboard)/budget/categories/_components/edit-category-sheet";
import { NewTransactionSheet } from "@/app/(dashboard)/budget/transactions/_components/new-transaction-sheet";
import { EditTransactionSheet } from "@/app/(dashboard)/budget/transactions/_components/edit-transaction-sheet";

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
      <EditTransactionSheet />
    </>
  );
};
