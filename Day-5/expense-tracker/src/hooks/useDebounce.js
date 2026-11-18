import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * 
 * Demonstrates:
 * 1. Side Effect: Managing an asynchronous timer (setTimeout).
 * 2. Dependency Array: Watches `[value, delay]`.
 * 3. Effect Cleanup (Timer): Crucial! When the user types another character before
 *    the delay finishes, React runs the cleanup function `clearTimeout(timer)`.
 *    This cancels the previous timeout, so debouncedValue only updates once typing pauses.
 * 4. Common Hook Mistake Avoided: Missing timer cleanup which causes memory leaks
 *    and delayed stale state overwrites.
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer to update debouncedValue after delay milliseconds
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // EFFECT CLEANUP: If `value` or `delay` changes before the timer completes,
    // or if the component unmounts, cancel the pending timer!
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
}
