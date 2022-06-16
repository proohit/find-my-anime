import { Box, BoxProps } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const AnimeTopic: FC<PropsWithChildren<BoxProps>> = (props) => {
  const { children, ...rest } = props;
  return (
    <Box w="100%" {...rest}>
      {children}
    </Box>
  );
};
