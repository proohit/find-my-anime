import {
  Box,
  ChakraProvider,
  Grid,
  theme,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import debounce from "lodash/debounce";
import { useState, useMemo, useCallback } from "react";
import { Api } from "./Api";
import WithSubnavigation from "./Navbar";
import { Filter, SearchForm } from "./SearchForm";

export const App = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [filters, setFilters] = useState<Filter>({});
  const filterActive = useMemo(
    () =>
      Object.values(filters).reduce(
        (active, value) => active || !!value,
        false
      ),
    [filters]
  );
  const debouncedRequest = useCallback(debounce(Api.getAnimeById, 2000), []);
  const updateFiltersAndRequest = (newFilters: Filter) => {
    setFilters(newFilters);
    debouncedRequest(newFilters.id!);
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
        </VStack>
      </Box>
    </ChakraProvider>
  );
};
