import { useNavigate } from "react-router-dom";
import { Filter } from "../components/SearchForm";

export const navigateToSearchWithFilters = (newFilters: Filter) => {
  const navigate = useNavigate();
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
