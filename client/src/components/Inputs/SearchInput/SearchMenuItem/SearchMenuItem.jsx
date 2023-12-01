// Components.
import { HStack, MenuItem, Text } from "@chakra-ui/react";

// SubComponent ( SearchMenu ).
function SearchMenuItem({ children, icon, value, setSearchType }) {
  return (
    <MenuItem onClick={() => setSearchType(value)} px={4}>
      <HStack spacing={3} opacity={0.7}>
        <Text>{icon}</Text>
        <Text mt={"3px"} fontWeight={"semibold"}>
          {children}
        </Text>
      </HStack>
    </MenuItem>
  );
}

export default SearchMenuItem;
