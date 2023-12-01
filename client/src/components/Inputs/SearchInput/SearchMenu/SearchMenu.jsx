// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Button, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
// Icons.
import { FaHashtag, FaUserGroup } from "react-icons/fa6";

// SubComponent ( SearchInput ).
function SearchMenu({ children, searchType }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu initialFocusRef>
      {searchType && (
        <MenuButton
          as={Button}
          size={"md"}
          color={isDark ? "whiteAlpha.700" : "blackAlpha.600"}
          variant={"solid"}
          borderRightRadius={"full"}
          w={"120px"}
          pr={14}
          bg={isDark ? "gothicPurpleAlpha.200" : "gothicPurpleAlpha.200"}
          _hover={{
            bg: isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300",
          }}
          _active={{
            bg: isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300",
          }}
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
      <MenuList
        bg={isDark ? "black" : "white"}
        zIndex={1600}
        borderRadius={"2xl"}
        border={"1px solid"}
        borderColor={"gothicPurpleAlpha.300"}
        py={4}
        boxShadow={"dark-lg"}
      >
        {children}
      </MenuList>
    </Menu>
  );
}

export default SearchMenu;
