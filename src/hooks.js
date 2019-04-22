import { useState } from "react";

export const useLocalStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setAndStoreValue = val => {
    try {
      setValue(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch (error) {
      console.log(error);
    }
  };

  return [value, setAndStoreValue];
};
