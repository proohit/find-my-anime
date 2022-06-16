import { Box, ChakraProvider, theme } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import WithSubnavigation from "./components/Navbar";
import { StateProvider } from "./components/StateProvider";

const AppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <StateProvider>
        <WithSubnavigation />
        <Box
          textAlign="center"
          w={["xs", "sm", "md", "800px", "1200px", "1400px"]}
          ml="auto"
          mr="auto"
        >
          {children}
        </Box>
      </StateProvider>
    </ChakraProvider>
  );
};
export default AppWrapper;
