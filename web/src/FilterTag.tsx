import {
  Tag,
  TagCloseButton,
  TagLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { FC } from "react";

export const FilterTag: FC<{ tag: string; onClick: () => void }> = (props) => {
  const { tag, onClick } = props;
  return (
    <Tag
      size={"md"}
      key={`tag-${tag}`}
      _hover={{
        bg: useColorModeValue("gray.100", "whiteAlpha.50"),
        cursor: "pointer",
      }}
      variant="outline"
      onClick={onClick}
    >
      <TagLabel>{tag}</TagLabel>
      <TagCloseButton onClick={onClick} />
    </Tag>
  );
};
