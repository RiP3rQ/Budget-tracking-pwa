import { insertCategoriesSchema } from "@/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const formSchema = insertCategoriesSchema.pick({
  name: true,
  description: true,
});

export type FormValues = z.infer<typeof formSchema>;

type Props = {
  id?: number;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const CategoryForm = ({
  id,
  defaultValues = {
    name: "",
    description: "",
  },
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
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
          name={"name"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder={"np. Wydatki, Przychody"}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={"description"}
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder={
                    "np. Wydatki na jedzenie, Przychody z wynagrodzenia"
                  }
                  type={"text"}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className={"w-full"} disabled={disabled}>
          {id ? "Zapisz zmiany" : "Dodaj kategorię"}
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
            Usuń kategorię
          </Button>
        )}
      </form>
    </Form>
  );
};
