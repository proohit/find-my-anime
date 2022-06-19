import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "../components/SearchForm";
import { StateContext } from "../components/StateProvider";

const useFilters = () => {
  const navigate = useNavigate();
  const { filters } = useContext(StateContext);

  const navigateToSearchWithFilters = (newFilters: Filter) => {
    const queryParams = new URLSearchParams();
    if (newFilters.tags && newFilters.tags.length > 0) {
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
    if (newFilters.includeAdult) {
      queryParams.set("includeAdult", newFilters.includeAdult.toString());
    } else {
      queryParams.delete("includeAdult");
    }
    navigate(`/search?${queryParams.toString()}`);
  };

  const filterByTag = (tag: string) => {
    const newFilters = {
      ...filters,
      tags: [...(filters.tags || []), tag],
    };
    navigateToSearchWithFilters(newFilters);
  };

  return {
    navigateToSearchWithFilters,
    filterByTag,
  };
};

export default useFilters;
