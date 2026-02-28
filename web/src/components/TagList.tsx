import { Badge, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

export interface TagListProps {
  tags: string[];
  limit?: number;
  onTagClick?: (tag: string) => void;
}
export const TagList: FC<TagListProps> = (props) => {
  const { tags, limit, onTagClick } = props;

  const hoverColor = useColorModeValue("gray.400", "gray.500");
  const bg = useColorModeValue("gray.200", "gray.700");
  return (
    <HStack justifyContent={"flex-start"} flexWrap="wrap" gap={1}>
      {tags.slice(0, limit).map((tag) => (
        <Tooltip label="Add to filter" openDelay={400} placement="top" key={tag}>
          <Badge
            onClick={() => onTagClick?.(tag)}
            key={tag}
            px={2}
            py={1}
            whiteSpace="normal"
            _hover={
              onTagClick
                ? {
                    cursor: "pointer",
                    bg: hoverColor,
                  }
                : undefined
            }
            bg={bg}
            fontWeight={"400"}
          >
            {tag}
          </Badge>
        </Tooltip>
      ))}
    </HStack>
  );
};
