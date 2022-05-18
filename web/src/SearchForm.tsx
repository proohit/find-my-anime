import {
  Input,
  Select,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { Provider } from "@find-my-anime/shared/constants/Provider";
import React, { ChangeEvent, FC } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Autocomplete } from "./Autocomplete";
import { FilterTag } from "./FilterTag";

type Props = {
  onFiltersChanged: (filter: Filter) => void;
  onLoadingChanged: (loading: boolean) => void;
  tags: string[];
};

export interface Filter {
  query?: string;
  id?: string;
  provider?: Provider;
  tags?: string[];
}

export const SearchForm: FC<Props> = (props) => {
  const { onFiltersChanged, tags, onLoadingChanged } = props;
  const [filters, setFilters] = React.useState<Filter>({});
  const debouncedEmitChange = useDebouncedCallback(onFiltersChanged, 1000, {
    trailing: true,
  });
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagChange = (filterTags: string[]) => {
    const updatedFilters = { ...filters, tags: filterTags };
    setFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagAdd = (tag: string) => {
    const updatedTags = new Set([...(filters.tags || []), tag]);
    const updatedFilters = { ...filters, tags: [...updatedTags] };
    setFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagRemove = (tag: string) => {
    if (filters.tags) {
      handleTagChange(filters.tags.filter((t) => t !== tag));
    }
  };

  return (
    <VStack
      alignItems="flex-start"
      bg={useColorModeValue("white.100", "gray.800")}
      w="100%"
    >
      <Input name="query" placeholder="Title" onChange={handleChange} />
      <Input name="id" onChange={handleChange} placeholder="Id" />
      <Select
        placeholder="Provider"
        value={filters.provider}
        onChange={handleChange}
        name="provider"
      >
        {Object.keys(Provider).map((provider) => (
          <option key={provider}>{provider}</option>
        ))}
      </Select>
      <Autocomplete items={tags} onItemClick={handleTagAdd} />
      <Wrap spacing="3">
        {filters.tags?.map((tag) => (
          <FilterTag tag={tag} onClick={() => handleTagRemove(tag)} />
        ))}
      </Wrap>
    </VStack>
  );
};
