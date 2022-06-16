import { createContext, FC, PropsWithChildren, useState } from "react";
import { Filter } from "./SearchForm";

type StateContextType = {
  filters: Filter;
  setFilters: (filters: Filter) => void;
};

export const StateContext = createContext<StateContextType>({
  filters: {},
  setFilters: () => {},
});

export const StateProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [filters, setFilters] = useState<Filter>({});

  return (
    <StateContext.Provider value={{ filters, setFilters }}>
      {children}
    </StateContext.Provider>
  );
};
