import {
  Box,
  Button,
  Collapse,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { ChangeEvent, FC } from "react";
import { FaFilter } from "react-icons/fa";
import { Provider } from "@find-my-anime/shared/constants/Provider";

type Props = {
  onToggle: () => void;
  filterActive: boolean;
  isOpen: boolean;
  onFiltersChanged: (filter: Filter) => void;
  filters: Filter;
};

export interface Filter {
  query?: string;
  id?: string;
  provider?: Provider;
}

export const SearchForm: FC<Props> = ({
  onToggle,
  filterActive,
  isOpen,
  filters,
  onFiltersChanged,
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) =>
    onFiltersChanged({ ...filters, [event.target.name]: event.target.value });

  return (
    <Box w="100%">
      <form>
        <InputGroup>
          <Input
            name="query"
            placeholder="Type to search..."
            onChange={handleChange}
          />
          <InputRightAddon p="0" w="24">
            <Button
              w="100%"
              variant="ghost"
              onClick={onToggle}
              aria-label={"filter"}
              color={
                filterActive
                  ? useColorModeValue("blue.500", "blue.200")
                  : useColorModeValue("gray.500", "gray.200")
              }
            >
              <FaFilter />
            </Button>
          </InputRightAddon>
        </InputGroup>
        <Collapse in={isOpen} animateOpacity>
          <Box bg={useColorModeValue("gray.100", "whiteAlpha.300")}>
            <Input name="id" onChange={handleChange} placeholder="Id" />
            <Select
              placeholder="Provider"
              value={filters.provider}
              onChange={handleChange}
              name="provider"
            >
              {Object.keys(Provider).map((provider) => (
                <option key={provider}>{provider}</option>
              ))}
            </Select>
          </Box>
        </Collapse>
      </form>
    </Box>
  );
};
