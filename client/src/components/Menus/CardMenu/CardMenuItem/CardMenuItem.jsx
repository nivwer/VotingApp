// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Button, MenuItem } from "@chakra-ui/react";

// SubComponent ( CardMenu ).
function CardMenuItem({ children, onClick, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <MenuItem
      as={Button}
      onClick={onClick}
      isDisabled={isLoading}
      w="100%"
      h="100%"
      px={3}
      py={2}
      borderRadius={0}
      variant="ghost"
      justifyContent="start"
      color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      bg={isDark ? "black" : "white"}
      opacity={isDark ? 0.9 : 0.7}
    >
      {children}
    </MenuItem>
  );
}

export default CardMenuItem;
