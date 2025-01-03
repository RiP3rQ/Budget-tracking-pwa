import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { insertTransactionsSchema } from "@/db/schema";
import { CustomSelector } from "@/components/custom-selector";
import { CustomDatePicker } from "@/components/custom-datepicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyValueInput } from "@/components/currency-input";
import { formatDateForDb } from "@/lib/dates";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  date: z.coerce.date({
    errorMap: () => ({ message: "Nieprawidłowa data" }),
  }),
  accountId: z
    .string({
      required_error: "Konto jest wymagane",
      invalid_type_error: "Nieprawidłowy format konta",
    })
    .min(1, "Konto jest wymagane"),

  categoryId: z
    .string({
      invalid_type_error: "Nieprawidłowy format kategorii",
    })
    .min(1, "Kategoria jest wymagana")
    .nullable()
    .optional(),

  payee: z
    .string({
      required_error: "Odbiorca jest wymagany",
      invalid_type_error: "Nieprawidłowy format odbiorcy",
    })
    .min(1, "Odbiorca/nadawca jest wymagany")
    .max(100, "Nazwa odbiorcy/nadawcy nie może przekraczać 100 znaków"),

  amount: z
    .string({
      required_error: "Kwota jest wymagana",
      invalid_type_error: "Kwota musi być liczbą",
    })
    .regex(
      /^-?\d+(\.\d{1,2})?$/,
      "Kwota musi być liczbą z maksymalnie dwoma miejscami po przecinku",
    )
    .refine((val) => !isNaN(parseFloat(val)), "Nieprawidłowy format kwoty")
    .refine((val) => parseFloat(val) !== 0, "Kwota nie może być równa 0"),

  note: z
    .string({
      invalid_type_error: "Nieprawidłowy format notatki",
    })
    .max(500, "Notatka nie może przekraczać 500 znaków")
    .nullable()
    .optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    amount: "0.00",
    payee: "",
    note: null,
    categoryId: null,
    accountId: "",
  },
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) => {
  const { userId } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    const formattedDate = formatDateForDb(values.date);
    onSubmit({
      ...values,
      amount: parseFloat(values.amount),
      categoryId:
        values.categoryId === null || values.categoryId === undefined
          ? null
          : parseInt(values.categoryId),
      accountId: parseInt(values.accountId),
      date: new Date(formattedDate),
      userId: userId!,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={"space-y-4 pt-4 text-muted-foreground"}
      >
        <FormField
          name={"date"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Data
                <RequiredSymbol />
              </FormLabel>
              <br />
              <FormControl>
                <CustomDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={"accountId"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Konto
                <RequiredSymbol />
              </FormLabel>
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={"amount"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Kwota
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <CurrencyValueInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  placeholder={"Wpisz kwotę..."}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name={"payee"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Odbiorca
                <RequiredSymbol />
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={disabled}
                  placeholder={"Wybierz odbiorcę ..."}
                />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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

function RequiredSymbol() {
  return <span className={"text-rose-500"}>*</span>;
}
