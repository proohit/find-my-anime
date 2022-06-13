import {
  Box,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { FC, useEffect, useRef, useState } from "react";
import { findBestMatch } from "string-similarity";
import { useDebouncedCallback } from "use-debounce";
import { VirtualizedItemList } from "./VirtualizedItemList";

export const Autocomplete: FC<{
  items: string[];
  onItemClick: (item: string) => void;
  selectedItems?: string[];
}> = (props) => {
  const { items, onItemClick, selectedItems } = props;
  const [filteredItems, setFilteredItems] = useState<string[]>(items || []);
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLInputElement>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    debouncedFilter(value);
  };

  const filterItems = (query: string) => {
    const bestMatch = findBestMatch(query, items);
    const sortedMatches = [...bestMatch.ratings].sort(
      (a, b) => b.rating - a.rating
    );
    const matches = sortedMatches.map((match) => match.target);
    if (matches) {
      setFilteredItems(matches);
    }
  };

  const debouncedFilter = useDebouncedCallback(filterItems, 200);

  return (
    <Box w="100%" ref={popoverRef}>
      <Popover matchWidth initialFocusRef={inputRef} returnFocusOnClose={false}>
        {({ onClose }) => {
          useOutsideClick({ ref: popoverRef, handler: onClose });

          return (
            <>
              <AutocompleteBody
                inputRef={inputRef}
                onChange={onChange}
                items={filteredItems}
                selectedItems={selectedItems}
                onItemClick={onItemClick}
              />
            </>
          );
        }}
      </Popover>
    </Box>
  );
};

type AutocompleteBodyProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: string[];
  selectedItems?: string[];
  onItemClick: (item: string) => void;
};
const AutocompleteBody: FC<AutocompleteBodyProps> = ({
  inputRef,
  onChange,
  items,
  selectedItems,
  onItemClick,
}) => {
  return (
    <>
      <PopoverTrigger>
        <Input placeholder="Tags" ref={inputRef} onChange={onChange} />
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverBody>
          <Box bg={useColorModeValue("white", "gray.700")} w="100%">
            <VirtualizedItemList
              items={items}
              selectedItems={selectedItems}
              onItemClick={onItemClick}
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </>
  );
};
