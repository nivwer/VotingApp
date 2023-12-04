import { useThemeInfo } from "../../../../hooks/Theme";
import { Button, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import { FaHashtag, FaUserGroup } from "react-icons/fa6";

function SearchMenu({ children, searchType }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu initialFocusRef>
      {searchType && (
        <MenuButton
          as={Button}
          color={isDark ? "whiteAlpha.700" : "blackAlpha.600"}
          borderRadius={0}
          borderRightRadius={{ base: 0, sm: "3xl" }}
          w={"120px"}
          pr={14}
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          _hover={{ bg: isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200" }}
          _active={{ bg: isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200" }}
          leftIcon={searchType == "users" ? <FaUserGroup /> : <FaHashtag />}
        >
          <Text mt={"2px"} fontWeight={"semibold"}>
            {searchType == "type" && "Type"}
            {searchType == "users" && "Users"}
            {searchType == "polls" && "Polls"}
          </Text>
        </MenuButton>
      )}
      <MenuList
        children={children}
        bg={isDark ? "black" : "white"}
        zIndex={1600}
        borderRadius={"2xl"}
        border={"1px solid"}
        borderColor={"gothicPurpleAlpha.300"}
        py={4}
        boxShadow={"dark-lg"}
      />
    </Menu>
  );
}

export default SearchMenu;
