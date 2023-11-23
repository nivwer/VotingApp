// Components.
import { HStack, MenuItem, Text } from "@chakra-ui/react";

// SubComponent ( NavbarSearchInput ).
function NavbarMenuItem({ children, icon, value, setSearchType }) {
  return (
    <MenuItem onClick={() => setSearchType(value)}>
      <HStack opacity={0.7}>
        <Text>{icon}</Text>
        <Text mt={"3px"} fontWeight={"semibold"}>{children}</Text>
      </HStack>
    </MenuItem>
  );
}

export default NavbarMenuItem;
