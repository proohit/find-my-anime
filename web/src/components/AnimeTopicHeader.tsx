import { Flex, Heading, HeadingProps } from "@chakra-ui/react";
import { FC, PropsWithChildren, ReactNode } from "react";

export const AnimeTopicHeader: FC<
  PropsWithChildren<HeadingProps> & { icon?: ReactNode }
> = (props) => {
  const { children, icon, ...rest } = props;
  return (
    <Flex alignItems="center" justifyContent="flex-start" gap={2} mb={2}>
      <Heading variant="h6" fontSize="md" textAlign="left" {...rest}>
        {children}
      </Heading>
      {icon}
    </Flex>
  );
};
