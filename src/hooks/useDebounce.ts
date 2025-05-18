import { useState, useEffect } from 'react';

export function useDebounce(value: unknown, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer); // clearTimeout nếu value thay đổi
  }, [value, delay]);

  return debouncedValue;
}
