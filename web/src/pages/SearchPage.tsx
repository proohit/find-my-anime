import { Spinner, VStack } from "@chakra-ui/react";
import { Provider } from "@find-my-anime/shared";
import { Anime } from "@find-my-anime/shared/interfaces/AnimeDb";
import { FC, useContext, useEffect, useState } from "react";
import Api from "../Api";
import AnimeList from "../components/AnimeList";
import { Filter, SearchForm } from "../components/SearchForm";
import { StateContext } from "../components/StateProvider";
import useFilters from "../hooks/useFilters";
import { useQuery } from "../hooks/useQuery";

const SearchPage: FC = () => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const { filters, setFilters, animeLoading, setAnimeLoading } =
    useContext(StateContext);
  const query = useQuery();
  const filterFns = useFilters();

  const updateFiltersFromQuery = () => {
    const title = query.get("title") || undefined;
    const tags = query.get("tags") || undefined;
    const excludedTags = query.get("excludedTags") || undefined;
    const provider =
      Object.values(Provider).find((prov) => prov === query.get("provider")) ||
      undefined;
    const id = query.get("id") || undefined;
    const includeAdult = query.get("includeAdult") || undefined;
    const filtersFromQuery: Filter = {
      query: title,
      tags: tags?.split(","),
      excludedTags: excludedTags?.split(","),
      provider,
      id,
      includeAdult: includeAdult === "true",
    };
    setFilters(filtersFromQuery);
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
      setAnimeLoading(false);
      return;
    }
    setAnimeLoading(true);
    const filteredAnimes = await Api.queryAnime(
      newFilters.id,
      newFilters.query,
      newFilters.provider,
      newFilters.tags,
      newFilters.excludedTags,
      newFilters.includeAdult
    );
    if (filteredAnimes) {
      setAnimes(filteredAnimes);
    }
    setAnimeLoading(false);
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
        onLoadingChanged={setAnimeLoading}
        onFiltersChanged={(changedFilters) =>
          filterFns.navigateToSearchWithFilters(changedFilters)
        }
        tags={availableTags}
        filters={filters}
      />
      {animeLoading && <Spinner />}
      {animes.length > 0 && <AnimeList animes={animes} />}
    </VStack>
  );
};
export default SearchPage;
