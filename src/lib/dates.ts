import { eachDayOfInterval, format, isSameDay, set, subDays } from "date-fns";
import { pl } from "date-fns/locale";

export function fillMissingDays(
  activeDats: {
    date: Date;
    income: number;
    expense: number;
  }[],
  startDate: Date,
  endDate: Date,
) {
  if (activeDats.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const transactionsByDay = allDays.map((day) => {
    const transaction = activeDats.find((d) => isSameDay(d.date, day));
    const formattedTransaction = transaction && {
      date: transaction.date.toDateString(),
      income: transaction.income,
      expense: transaction.expense,
    };
    return (
      formattedTransaction || {
        date: new Date(day).toDateString(),
        income: 0,
        expense: 0,
      }
    );
  });

  return transactionsByDay;
}

export function formatDateForDb(date: Date) {
  // Parse the date string
  const originalDate = new Date(date);
  // Set the time to T00:00:00.000
  const updatedDate = set(originalDate, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  // Format the updated date to ISO 8601
  const formattedDate = format(updatedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  return format(date, "yyyy-MM-dd");
}

// dateRange formatter
type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from)
    return `${format(defaultFrom, "dd MMMM", { locale: pl })} - ${format(defaultTo, "dd MMMM", { locale: pl })}`;

  if (period?.to)
    return `${format(period.from, "dd MMMM", { locale: pl })} - ${format(period.to, "dd MMMM", { locale: pl })}`;

  return format(period.from, "dd MMMM", { locale: pl });
}
