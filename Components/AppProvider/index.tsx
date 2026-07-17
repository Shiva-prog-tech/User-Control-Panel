"use client";

import { createContext, useContext, useMemo, useState } from "react";

// App-level (non-redux) context: UI concerns like theme that sit above the store.
type Theme = "light" | "dark";

interface AppContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextValue>({
  theme: "light",
  setTheme: () => {},
});

export const useAppContext = () => useContext(AppContext);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
