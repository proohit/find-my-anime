import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import WithSubnavigation from "./Navbar";

const AppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      <Box
        textAlign="center"
        w={["xs", "sm", "lg", "xl", "1200px"]}
        ml="auto"
        mr="auto"
      >
        {children}
      </Box>
    </ChakraProvider>
  );
};
export default AppWrapper;
