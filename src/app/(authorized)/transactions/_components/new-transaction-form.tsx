import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { insertTransactionsSchema } from "@/db/schema";
import { CustomSelector } from "@/components/custom-selector";
import { CustomDatePicker } from "@/components/custom-datepicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomCurrencyInput } from "@/components/currency-input";
import { convertAmountToMiliUnits, formatDateForDb } from "@/lib/utils";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  note: z.string().nullable().optional(),
});

const apiSchema = insertTransactionsSchema.omit({ id: true });

export type FormValues = z.infer<typeof formSchema>;
export type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: number;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
  id,
  defaultValues = {
    date: new Date(),
    amount: "0",
    payee: "",
    note: "",
    categoryId: null,
    accountId: "0",
  },
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const amountInMiliunits = convertAmountToMiliUnits(
      parseFloat(values.amount),
    );
    const formattedDate = formatDateForDb(values.date);
    onSubmit({
      ...values,
      amount: amountInMiliunits,
      categoryId:
        values.categoryId === null || values.categoryId === undefined
          ? null
          : parseInt(values.categoryId),
      accountId: parseInt(values.accountId),
      date: new Date(formattedDate),
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={"space-y-4 pt-4"}
      >
        <FormField
          name={"date"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <br />
              <FormControl>
                <CustomDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"accountId"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konto</FormLabel>
              <FormControl>
                <CustomSelector
                  placeholder={"Wybierz konto"}
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={String(field.value)}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"categoryId"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategoria</FormLabel>
              <FormControl>
                <CustomSelector
                  placeholder={"Wybierz kategorię"}
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={String(field.value)}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"amount"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kwota</FormLabel>
              <FormControl>
                <CustomCurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder={"Wpisz kwotę..."}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"payee"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Odbiorca</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder={"Wybierz odbiorcę ..."}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"note"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notatka</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder={"Napisz opcjonalną notatkę..."}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          className={"w-full z-50"}
          disabled={disabled}
          onClick={() => {
            form.handleSubmit(handleSubmit);
          }}
        >
          {id ? "Zapisz zmiany" : "Dodaj transakcję"}
        </Button>
        {!!id && (
          <Button
            disabled={disabled}
            type={"button"}
            onClick={handleDelete}
            className={"w-full"}
            variant={"outline"}
          >
            <Trash className={"size-4 mr-2"} />
            Usuń transakcję
          </Button>
        )}
      </form>
    </Form>
  );
};
