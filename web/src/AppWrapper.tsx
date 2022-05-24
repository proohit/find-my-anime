import { ChakraProvider, theme } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import WithSubnavigation from "./Navbar";

const AppWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ChakraProvider theme={theme}>
      <WithSubnavigation />
      {children}
    </ChakraProvider>
  );
};
export default AppWrapper;
