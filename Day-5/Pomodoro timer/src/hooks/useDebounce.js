import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * Demonstrates:
 * 1. Side Effect: setTimeout
 * 2. Effect Cleanup: clearTimeout runs before next keystroke or unmount
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
