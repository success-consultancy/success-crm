export const useLocalStorage = () => {
  const isBrowser = typeof window !== "undefined";

  const setItem = (key: string, value: unknown): void => {
    if (isBrowser) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getItem = <T>(key: string, defaultValue: T): T => {
    if (isBrowser) {
      try {
        const item = localStorage.getItem(key);
        return (item as T) ?? defaultValue;
      } catch (error) {
        console.error(error);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const removeItem = (key: string): void => {
    if (isBrowser) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return { setItem, getItem, removeItem };
};
