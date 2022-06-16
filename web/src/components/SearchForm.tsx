import { Select, useColorModeValue, VStack, Wrap } from "@chakra-ui/react";
import { Provider } from "@find-my-anime/shared/constants/Provider";
import React, { ChangeEvent, FC, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Autocomplete } from "./Autocomplete";
import { FilterTag } from "./FilterTag";
import ResetableInput from "./ResetableInput";

type Props = {
  onFiltersChanged: (filter: Filter) => void;
  onLoadingChanged: (loading: boolean) => void;
  tags: string[];
  filters: Filter;
};

export interface Filter {
  query?: string;
  id?: string;
  provider?: Provider;
  tags?: string[];
}

export const SearchForm: FC<Props> = (props) => {
  const { onFiltersChanged, tags, onLoadingChanged, filters } = props;
  const [localFilters, setLocalFilters] = React.useState<Filter>(filters);
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const debouncedEmitChange = useDebouncedCallback(onFiltersChanged, 1000, {
    trailing: true,
  });
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedFilters = { ...localFilters, [name]: value };
    setLocalFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const resetFilterField = (name: string) => {
    const updatedFilters = { ...localFilters, [name]: "" };
    setLocalFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagChange = (filterTags: string[]) => {
    const updatedFilters = { ...localFilters, tags: filterTags };
    setLocalFilters(updatedFilters);
    onLoadingChanged(true);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagAdd = (tag: string) => {
    if (localFilters.tags?.includes(tag)) {
      handleTagRemove(tag);
    } else {
      const updatedTags = [...(localFilters.tags || []), tag];
      const updatedFilters = { ...localFilters, tags: [...updatedTags] };
      setLocalFilters(updatedFilters);
      onLoadingChanged(true);
      debouncedEmitChange(updatedFilters);
    }
  };

  const handleTagRemove = (tag: string) => {
    if (localFilters.tags) {
      handleTagChange(localFilters.tags.filter((t) => t !== tag));
    }
  };

  return (
    <VStack
      alignItems="flex-start"
      bg={useColorModeValue("white.100", "gray.800")}
      w="100%"
    >
      <ResetableInput
        name="query"
        placeholder="Title"
        onChange={handleChange}
        value={localFilters.query}
        onReset={() => resetFilterField("query")}
      />
      <ResetableInput
        name="id"
        onChange={handleChange}
        placeholder="Id"
        value={localFilters.id}
        onReset={() => resetFilterField("id")}
      />
      <Select
        placeholder="Provider"
        value={localFilters.provider}
        onChange={handleChange}
        name="provider"
      >
        {Object.keys(Provider).map((provider) => (
          <option key={provider}>{provider}</option>
        ))}
      </Select>
      <Autocomplete
        items={tags}
        onItemClick={handleTagAdd}
        selectedItems={localFilters.tags}
      />
      <Wrap spacing="3">
        {localFilters.tags?.map((tag) => (
          <FilterTag tag={tag} onClick={() => handleTagRemove(tag)} />
        ))}
      </Wrap>
    </VStack>
  );
};
