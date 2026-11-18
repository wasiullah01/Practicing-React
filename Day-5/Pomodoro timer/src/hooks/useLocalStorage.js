import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Side Effect & Lifecycle:
 * 1. Reads initial value from browser localStorage on mount (lazy initial state)
 * 2. Writes to localStorage whenever key or state changes
 * 3. Listens to storage events for multi-tab sync and cleans up event listener
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      console.warn(`Error reading localStorage "${key}":`, e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing localStorage "${key}":`, e);
    }
  }, [key, value]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [value, setValue];
}
