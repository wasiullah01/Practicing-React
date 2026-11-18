import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage.
 * 
 * Demonstrates:
 * 1. Side Effect: Reading and writing to browser localStorage (external system).
 * 2. Common Hook Mistake Avoided: Synchronous localStorage reading on every render.
 *    Instead, we use a lazy initializer function in useState(() => ...) which runs ONLY ON MOUNT!
 * 3. useEffect Hook & Dependency Array: Updates localStorage whenever the key or stored value changes.
 * 4. Effect Cleanup: Listens for window 'storage' events so other tabs stay in sync,
 *    and cleans up the listener when the component unmounts.
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initial state - only runs once on component mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Side Effect 1: Write to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]); // Dependency array: only re-runs if key or storedValue changes

  // Side Effect 2: Multi-tab sync via storage event listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage sync for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // EFFECT CLEANUP: Prevents memory leaks by removing listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]); // Re-subscribe only if key changes

  return [storedValue, setStoredValue];
}
