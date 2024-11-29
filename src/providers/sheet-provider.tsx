"use client";

import { NewAccountSheet } from "@/app/(authorized)/accounts/_components/new-account-sheet";
import { EditAccountSheet } from "@/app/(authorized)/accounts/_components/edit-account-sheet";
import { NewCategorySheet } from "@/app/(authorized)/categories/_components/new-category-sheet";
import { EditCategorySheet } from "@/app/(authorized)/categories/_components/edit-category-sheet";
import { NewTransactionSheet } from "@/app/(authorized)/transactions/_components/new-transaction-sheet";
import { EditTransactionSheet } from "@/app/(authorized)/transactions/_components/edit-transaction-sheet";
import { useEffect, useState } from "react";

export const SheetProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

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
