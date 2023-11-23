// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { HStack, MenuItem, Text } from "@chakra-ui/react";

// SubComponent ( CardMenu ).
function CardMenuItem({ children, onClick, icon, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <MenuItem onClick={onClick} isDisabled={isLoading}>
      <HStack opacity={0.6}>
        <Text>{icon}</Text>
        <Text mt={"3px"} fontWeight={"semibold"}>
          {children}
        </Text>
      </HStack>
    </MenuItem>
  );
}

export default CardMenuItem;
