import {
  Box,
  InputGroup,
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
import ResetableInput from "./ResetableInput";
import { VirtualizedItemList } from "./VirtualizedItemList";

export const Autocomplete: FC<{
  items: string[];
  onItemClick: (item: string) => void;
  selectedItems?: string[];
}> = (props) => {
  const { items, onItemClick, selectedItems } = props;
  const [filteredItems, setFilteredItems] = useState<string[]>(items || []);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLInputElement>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    filterItems(value);
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

  const handleItemClick = (item: string) => {
    onItemClick(item);
    inputRef.current?.focus();
  };

  const handleReset = () => {
    setInputValue("");
    inputRef.current?.focus();
  };


  return (
    <Box w="100%" ref={popoverRef}>
      <Popover
        matchWidth
        placement="bottom"
        initialFocusRef={inputRef}
        returnFocusOnClose={false}
      >
        {({ onClose }) => {
          return (
            <>
              <AutocompleteBody
                inputRef={inputRef}
                popoverRef={popoverRef}
                onClose={onClose}
                onChange={onChange}
                items={filteredItems}
                selectedItems={selectedItems}
                onItemClick={handleItemClick}
                onReset={handleReset}
                value={inputValue}
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
  popoverRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: string[];
  selectedItems?: string[];
  onItemClick: (item: string) => void;
  onReset: () => void;
  value: string;
};
const AutocompleteBody: FC<AutocompleteBodyProps> = ({
  inputRef,
  popoverRef,
  onClose,
  onChange,
  items,
  selectedItems,
  onItemClick,
  onReset,
  value,
}) => {
  const bg = useColorModeValue("white", "gray.700");
  useOutsideClick({ ref: popoverRef, handler: onClose });

  return (
    <>
      <PopoverTrigger>
        <InputGroup>
          <ResetableInput
            inputRef={inputRef}
            placeholder="Tags"
            onChange={onChange}
            value={value}
            onReset={onReset}
          />
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverBody>
          <Box bg={bg} w="100%">
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
