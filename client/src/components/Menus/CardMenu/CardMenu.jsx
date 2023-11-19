// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Menu, MenuButton, IconButton, MenuList } from "@chakra-ui/react";
// Icon.
import { FaEllipsis } from "react-icons/fa6";

// Component.
function CardMenu({ children, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <Menu>
      <MenuButton
        isDisabled={isLoading}
        as={IconButton}
        aria-label={"Options"}
        icon={<FaEllipsis />}
        borderRadius={"full"}
        variant={"ghost"}
        opacity={0.6}
        position={"absolute"}
        right={5}
      />
      <MenuList bg={isDark ? "black" : "white"} zIndex={1100}>
        {children}
      </MenuList>
    </Menu>
  );
}

export default CardMenu;
