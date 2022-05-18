import {
  Popover,
  PopoverTrigger,
  Input,
  PopoverContent,
  PopoverBody,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import { VirtualizedItemList } from "./VirtualizedItemList";
import { findBestMatch } from "string-similarity";
import { useDebouncedCallback } from "use-debounce";

export const Autocomplete: FC<{
  items: string[];
  onItemClick: (item: string) => void;
}> = (props) => {
  const { items, onItemClick } = props;
  const [filteredItems, setFilteredItems] = useState<string[]>(items || []);
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log("event");
    debouncedFilter(value);
  };

  const filterItems = (query: string) => {
    console.log("filtering");
    const bestMatch = findBestMatch(query, items);
    const sortedAndSlicedMatches = [...bestMatch.ratings]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 15);
    const matches = sortedAndSlicedMatches.map((match) => match.target);
    if (matches) {
      setFilteredItems(matches);
    }
  };

  const debouncedFilter = useDebouncedCallback(filterItems, 200);

  return (
    <Popover matchWidth initialFocusRef={inputRef}>
      <PopoverTrigger>
        <Input placeholder="Tags" ref={inputRef} onChange={onChange} />
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverBody>
          <Box bg={useColorModeValue("white", "gray.700")} w="100%">
            <VirtualizedItemList
              items={filteredItems}
              onItemClick={onItemClick}
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
