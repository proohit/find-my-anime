import { HStack, Badge, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

export interface TagListProps {
  tags: string[];
  limit?: number;
}
export const TagList: FC<TagListProps> = (props) => {
  const { tags, limit } = props;
  return (
    <HStack p={2} justifyContent={"flex-start"} flexWrap="wrap" gap={1}>
      {tags.slice(0, limit).map((tag) => (
        <Badge
          key={tag}
          px={2}
          py={1}
          bg={useColorModeValue("gray.200", "gray.700")}
          fontWeight={"400"}
        >
          {tag}
        </Badge>
      ))}
    </HStack>
  );
};
