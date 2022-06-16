import { Spinner, VStack } from "@chakra-ui/react";
import { Provider } from "@find-my-anime/shared";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimeList from "./AnimeList";
import Api from "./Api";
import { Filter, SearchForm } from "./SearchForm";
import { useQuery } from "./useQuery";

const SearchPage = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<Filter>({});
  const query = useQuery();
  const navigate = useNavigate();

  const updateFiltersInQuery = (newFilters: Filter) => {
    const queryParams = new URLSearchParams();
    if (newFilters.tags) {
      queryParams.set("tags", newFilters.tags?.join(","));
    } else {
      queryParams.delete("tags");
    }
    if (newFilters.query) {
      queryParams.set("title", newFilters.query);
    } else {
      queryParams.delete("title");
    }
    if (newFilters.id) {
      queryParams.set("id", newFilters.id.toString());
    } else {
      queryParams.delete("id");
    }
    if (newFilters.provider) {
      queryParams.set("provider", newFilters.provider.toString());
    } else {
      queryParams.delete("provider");
    }
    navigate(`/search?${queryParams.toString()}`);
  };

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
        onFiltersChanged={updateFiltersInQuery}
        tags={availableTags}
        filters={currentFilters}
      />
      {isLoading && <Spinner />}
      {animes.length > 0 && <AnimeList animes={animes} />}
    </VStack>
  );
};
export default SearchPage;
