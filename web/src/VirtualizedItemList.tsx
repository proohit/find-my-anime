import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { CSSProperties, FC } from "react";
import { FixedSizeList as List } from "react-window";

export const VirtualizedItemList: FC<{
  items: string[];
  onItemClick: (item: string) => void;
}> = (props) => {
  const { items, onItemClick } = props;
  return (
    <List
      height={300}
      itemCount={items.length}
      itemSize={35}
      width="100%"
      itemData={items}
    >
      {({ index, style, data }) => (
        <VirtualizedItem
          index={index}
          data={data}
          style={style}
          onItemClick={onItemClick}
        />
      )}
    </List>
  );
};

const VirtualizedItem: FC<{
  index: number;
  style?: CSSProperties;
  data: string[];
  onItemClick: (tag: string) => void;
}> = (props) => {
  const { index, style, data, onItemClick } = props;
  const item = data?.[index];
  return (
    <Box
      onClick={() => onItemClick(item)}
      style={style}
      key={`option-${item}`}
      textAlign="left"
      textTransform="capitalize"
      color={useColorModeValue("gray.700", "gray.300")}
      w="100%"
      _hover={{
        bg: useColorModeValue("gray.100", "whiteAlpha.100"),
      }}
      _selected={{
        bg: useColorModeValue("gray.300", "whiteAlpha.300"),
      }}
    >
      {item}
    </Box>
  );
};
