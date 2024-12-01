import { useCallback, useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";

interface UseAccountFilterStateProps {
  queryKey: string;
  storageKey: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

export function useAccountFilterState({
  queryKey,
  storageKey,
  defaultValue,
  onValueChange,
}: UseAccountFilterStateProps) {
  const [queryValue, setQueryValue] = useQueryState(
    queryKey,
    parseAsString.withOptions({ shallow: true }).withDefault(defaultValue),
  );

  useEffect(() => {
    const storedValue = localStorage.getItem(storageKey);

    if (storedValue && storedValue !== queryValue) {
      setQueryValue(storedValue);
    } else if (!storedValue && queryValue !== defaultValue) {
      localStorage.setItem(storageKey, queryValue);
    }
  }, []);

  const setValue = useCallback(
    (newValue: string) => {
      setQueryValue(newValue);
      localStorage.setItem(storageKey, newValue);
      onValueChange?.(newValue);
    },
    [setQueryValue, storageKey, onValueChange],
  );

  return [queryValue, setValue] as const;
}
