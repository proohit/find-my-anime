import {
  Popover,
  PopoverTrigger,
  Input,
  PopoverContent,
  PopoverBody,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import { VirtualizedItemList } from "./VirtualizedItemList";

export const Autocomplete: FC<{
  items: string[];
  onItemClick: (item: string) => void;
}> = (props) => {
  const { items, onItemClick } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Popover matchWidth initialFocusRef={inputRef}>
      <PopoverTrigger>
        <Input placeholder="Tags" ref={inputRef} />
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverBody>
          <Box bg={useColorModeValue("white", "gray.700")} w="100%">
            <VirtualizedItemList items={items} onItemClick={onItemClick} />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
