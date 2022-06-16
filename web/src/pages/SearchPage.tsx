import { Spinner, VStack } from "@chakra-ui/react";
import { Provider } from "@find-my-anime/shared";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { useEffect, useState } from "react";
import Api from "../Api";
import AnimeList from "../components/AnimeList";
import { Filter, SearchForm } from "../components/SearchForm";
import { navigateToSearchWithFilters } from "../utils/navigateToSearchWithFilters";
import { useQuery } from "../utils/useQuery";

const SearchPage = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filter>({});
  const query = useQuery();

  const updateFiltersFromQuery = () => {
    const title = query.get("title") || undefined;
    const tags = query.get("tags") || undefined;
    const provider =
      Object.values(Provider).find((prov) => prov === query.get("provider")) ||
      undefined;
    const id = query.get("id") || undefined;
    const filtersFromQuery: Filter = {
      query: title,
      tags: tags?.split(","),
      provider,
      id,
    };
    setCurrentFilters(filtersFromQuery);
    return filtersFromQuery;
  };

  const loadAnimeWithFilters = async (newFilters: Filter) => {
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

  const loadAvailableTags = async () => {
    const tags = await Api.getTags();
    setAvailableTags(tags);
  };

  useEffect(() => {
    loadAvailableTags();
  }, []);

  useEffect(() => {
    const filtersFromQuery = updateFiltersFromQuery();
    loadAnimeWithFilters(filtersFromQuery);
  }, [query]);

  return (
    <VStack spacing={8} mt="10">
      <SearchForm
        onLoadingChanged={setIsLoading}
        onFiltersChanged={navigateToSearchWithFilters}
        tags={availableTags}
        filters={currentFilters}
      />
      {isLoading && <Spinner />}
      {animes.length > 0 && <AnimeList animes={animes} />}
    </VStack>
  );
};
export default SearchPage;
