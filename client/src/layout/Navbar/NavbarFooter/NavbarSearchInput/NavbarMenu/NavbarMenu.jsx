// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
// Components.
import { Button, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
// Icons.
import { FaHashtag, FaUserGroup } from "react-icons/fa6";

// SubComponent ( NavbarSearchInput ).
function NavbarMenu({ children, searchType }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu>
      {searchType && (
        <MenuButton
          opacity={isDark ? 0.5 : 1}
          as={Button}
          size={"sm"}
          color={isDark ? "whiteAlpha.900" : "blackAlpha.500"}
          variant={"solid"}
          borderRightRadius={"full"}
          w={"100px"}
          pr={7}
          leftIcon={
            <>
              {(searchType == "type" || searchType == "polls") && <FaHashtag />}
              {searchType == "users" && <FaUserGroup />}
            </>
          }
        >
          <Text mt={"2px"} fontWeight={"semibold"}>
            {searchType == "type" && "Type"}
            {searchType == "users" && "Users"}
            {searchType == "polls" && "Polls"}
          </Text>
        </MenuButton>
      )}
      <MenuList bg={isDark ? "black" : "white"} zIndex={1100}>
        {children}
      </MenuList>
    </Menu>
  );
}

export default NavbarMenu;
