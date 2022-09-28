import {
  Tag,
  TagCloseButton,
  TagLabel,
  TagRightIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC } from "react";
import { MdBlock } from "react-icons/md";

export const FilterTag: FC<{
  tag: string;
  onRemove: () => void;
  excluded?: boolean;
  onExclude: () => void;
}> = (props) => {
  const { tag, onRemove, onExclude, excluded } = props;
  const tagBg = useColorModeValue("orange.200", "orange.800");
  return (
    <Tag
      size={"md"}
      key={`tag-${tag}`}
      variant="outline"
      bg={excluded ? tagBg : undefined}
    >
      <TagLabel>{tag}</TagLabel>
      <TagRightIcon
        as={MdBlock}
        onClick={onExclude}
        color={useColorModeValue("gray.400", "gray.500")}
        _hover={{
          cursor: "pointer",
          color: useColorModeValue("gray.500", "gray.400"),
        }}
      />
      <TagCloseButton onClick={onRemove} />
    </Tag>
  );
};
