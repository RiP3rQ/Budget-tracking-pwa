import { parseAsIsoDate, useQueryState } from "nuqs";
import { useCallback, useEffect } from "react";

interface UseDateRangeFilterStateProps {
  queryKey: string;
  storageKey: string;
  defaultValue: Date;
  onValueChange?: (value: Date) => void;
}

export function useDateRangeFilterState({
  queryKey,
  storageKey,
  defaultValue,
  onValueChange,
}: UseDateRangeFilterStateProps) {
  const [queryValue, setQueryValue] = useQueryState(
    queryKey,
    parseAsIsoDate.withOptions({ shallow: true }).withDefault(defaultValue),
  );

  useEffect(() => {
    const storedValue = localStorage.getItem(storageKey);

    if (storedValue) {
      try {
        const parsedDate = new Date(storedValue);
        if (parsedDate.toString() !== queryValue.toString()) {
          setQueryValue(parsedDate);
        }
      } catch (error) {
        console.error("Failed to parse stored date", error);
        localStorage.removeItem(storageKey);
      }
    } else if (queryValue !== defaultValue) {
      localStorage.setItem(storageKey, queryValue.toISOString());
    }
  }, []);

  const setValue = useCallback(
    (newValue: Date) => {
      setQueryValue(newValue);
      localStorage.setItem(storageKey, newValue.toISOString());
      onValueChange?.(newValue);
    },
    [setQueryValue, storageKey, onValueChange],
  );

  return [queryValue, setValue] as const;
}
