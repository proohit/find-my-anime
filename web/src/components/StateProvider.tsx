import { createContext, FC, PropsWithChildren, useState } from "react";
import { Filter } from "./SearchForm";

type StateContextType = {
  filters: Filter;
  setFilters: (filters: Filter) => void;
  animeLoading: boolean;
  setAnimeLoading: (animeLoading: boolean) => void;
};

export const StateContext = createContext<StateContextType>({
  filters: {},
  setFilters: () => {},
  animeLoading: false,
  setAnimeLoading: () => {},
});

export const StateProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [filters, setFilters] = useState<Filter>({});
  const [animeLoading, setAnimeLoading] = useState(false);

  return (
    <StateContext.Provider
      value={{ filters, setFilters, animeLoading, setAnimeLoading }}
    >
      {children}
    </StateContext.Provider>
  );
};
