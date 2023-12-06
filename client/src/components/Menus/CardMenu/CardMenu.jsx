import { useThemeInfo } from "../../../hooks/Theme";
import { Menu, MenuButton, MenuList, IconButton } from "@chakra-ui/react";
import { FaEllipsis } from "react-icons/fa6";

function CardMenu({ children, isLoading, ...props }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu initialFocusRef placement="bottom-end">
      <MenuButton
        as={IconButton}
        isDisabled={isLoading}
        aria-label={"Options"}
        icon={<FaEllipsis />}
        variant={"ghost"}
        borderRadius={"full"}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        colorScheme={"gothicPurpleAlpha"}
        bg={"transparents"}
        _hover={{ bg: "gothicPurpleAlpha.200" }}
        _active={{ bg: "gothicPurpleAlpha.300" }}
        position={"absolute"}
        right={5}
        {...props}
      />
      <MenuList
        children={children}
        bg={isDark ? "black" : "white"}
        zIndex={1600}
        borderRadius={"2xl"}
        w={"100%"}
        border={"1px solid"}
        borderColor={"gothicPurpleAlpha.300"}
        py={4}
        boxShadow={"2xl"}
      />
    </Menu>
  );
}

export default CardMenu;
