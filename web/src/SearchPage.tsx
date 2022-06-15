import { Spinner, VStack } from "@chakra-ui/react";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { useEffect, useState } from "react";
import AnimeList from "./AnimeList";
import Api from "./Api";
import { Filter, SearchForm } from "./SearchForm";

const SearchPage = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateFiltersAndRequest = async (newFilters: Filter) => {
    const hasAnyFilters = Object.values(newFilters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    });
    if (!hasAnyFilters) {
      setAnimes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const filteredAnimes = await Api.queryAnime(
      newFilters.id,
      newFilters.query,
      newFilters.provider,
      newFilters.tags
    );
    if (filteredAnimes) {
      setAnimes(filteredAnimes);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    Api.getTags().then((tags) => {
      setAvailableTags(tags);
    });
  }, []);

  return (
    <VStack spacing={8} mt="10">
      <SearchForm
        onLoadingChanged={setIsLoading}
        onFiltersChanged={updateFiltersAndRequest}
        tags={availableTags}
      />
      {isLoading && <Spinner />}
      {animes.length > 0 && <AnimeList animes={animes} />}
    </VStack>
  );
};
export default SearchPage;
