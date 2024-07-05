import { useEffect, useState } from "react";

const useTheme = (): string => {
  const [themeValue, setThemeValue] = useState("");

  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setThemeValue(currentTheme);
  }, []);

  return themeValue;
};

export default useTheme;
