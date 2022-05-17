import {
  Box,
  ChakraProvider,
  Spinner,
  theme,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Anime } from "find-my-anime-shared";
import debounce from "lodash/debounce";
import { useState, useMemo, useCallback } from "react";
import AnimeList from "./AnimeList";
import Api from "./Api";
import WithSubnavigation from "./Navbar";
import { Filter, SearchForm } from "./SearchForm";

export const App = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [filters, setFilters] = useState<Filter>({});
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const filterActive = useMemo(
    () =>
      Object.values(filters).reduce(
        (active, value) => active || !!value,
        false
      ),
    [filters]
  );
  const debouncedRequest = useCallback(
    debounce(Api.queryAnime, 2000, { leading: true }),
    []
  );
  const updateFiltersAndRequest = async (newFilters: Filter) => {
    if (!newFilters.query) {
      setAnimes([]);
      return;
    }
    setFilters(newFilters);
    setIsLoading(true);
    const filteredAnimes = await debouncedRequest(
      newFilters.query,
      newFilters.id,
      newFilters.provider
    );
    if (filteredAnimes) {
      setAnimes(filteredAnimes);
    }
    setIsLoading(false);
  };
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Box textAlign="center" fontSize="xl">
        <VStack spacing={8} w={"lg"} ml="auto" mr="auto" mt="10">
          <SearchForm
            onFiltersChanged={updateFiltersAndRequest}
            filters={filters}
            onToggle={onToggle}
            filterActive={filterActive}
            isOpen={isOpen}
          />
          {animes.length > 0 && <AnimeList animes={animes} />}
          {isLoading && <Spinner />}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
