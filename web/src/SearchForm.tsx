import {
  FormLabel,
  Input,
  Select,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";
import { Provider } from "@find-my-anime/shared/constants/Provider";
import React, { ChangeEvent, FC } from "react";
import { useDebouncedCallback } from "use-debounce";
type Props = {
  onFiltersChanged: (filter: Filter) => void;
  filters: Filter;
  tags: string[];
};

export interface Filter {
  query?: string;
  id?: string;
  provider?: Provider;
  tags?: string[];
}

export const SearchForm: FC<Props> = (props) => {
  const { filters, onFiltersChanged, tags } = props;

  const [localFilter, setLocalFilter] = React.useState<Filter>({ ...filters });
  const debouncedEmitChange = useDebouncedCallback(onFiltersChanged, 1000, {
    trailing: true,
  });

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const updatedFilters = { ...localFilter, [name]: value };
    setLocalFilter(updatedFilters);
    debouncedEmitChange(updatedFilters);
  };

  const handleTagChange = (filterTags: string[]) => {
    const updatedFilters = { ...localFilter, tags: filterTags };
    setLocalFilter(updatedFilters);
    debouncedEmitChange(updatedFilters);
  };

  return (
    <VStack bg={useColorModeValue("white.100", "gray.800")} w="100%">
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
      <AutoComplete freeSolo openOnFocus multiple onChange={handleTagChange}>
        <FormLabel>Tags</FormLabel>
        <AutoCompleteInput>
          {({ tags: itemTags }) =>
            itemTags.map((tag, tid) => (
              <AutoCompleteTag
                key={tid}
                label={tag.label}
                onRemove={tag.onRemove}
              />
            ))
          }
        </AutoCompleteInput>
        <AutoCompleteList bg={useColorModeValue("white", "gray.800")}>
          {tags.map((tag) => (
            <AutoCompleteItem
              key={`option-${tag}`}
              value={tag}
              textTransform="capitalize"
              _hover={{ bg: useColorModeValue("gray.100", "whiteAlpha.100") }}
              _selected={{
                bg: useColorModeValue("gray.300", "whiteAlpha.300"),
              }}
            >
              {tag}
            </AutoCompleteItem>
          ))}
        </AutoCompleteList>
      </AutoComplete>
    </VStack>
  );
};
