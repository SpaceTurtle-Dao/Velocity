import { writable } from "svelte/store";

export function createLocalStorageStore<T>(
  key: string,
  initialValue: T,
  options: {
    comparator?: (a: any, b: any) => number;
  } = {}
) {
  const isBrowser = typeof window !== "undefined";
  const { comparator } = options;

  const serialize = (value: T) => JSON.stringify(value);
  const deserialize = (value: string) => {
    const parsed = JSON.parse(value) as T;
    return comparator && Array.isArray(parsed)
      ? parsed.sort(comparator)
      : parsed;
  };

  const stored = isBrowser ? localStorage.getItem(key) : null;
  const initial = stored ? deserialize(stored) : initialValue;

  const store = writable<T>(initial);

  store.subscribe((value) => {
    if (isBrowser) {
      localStorage.setItem(key, serialize(value));
    }
  });

  return {
    subscribe: store.subscribe,
    set: (value: T) => {
      store.set(
        comparator && Array.isArray(value) ? value.sort(comparator) : value
      );
    },
    update: (updater: (value: T) => T) => {
      store.update((value) => {
        const updated = updater(value);
        return comparator && Array.isArray(updated)
          ? updated.sort(comparator)
          : updated;
      });
    },
    reset: () => {
      store.set(initialValue);
      if (isBrowser) {
        localStorage.removeItem(key);
      }
    },
  };
}