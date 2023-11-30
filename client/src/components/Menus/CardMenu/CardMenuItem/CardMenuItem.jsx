// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { HStack, MenuItem, Text } from "@chakra-ui/react";

// SubComponent ( CardMenu ).
function CardMenuItem({ children, onClick, icon, isLoading }) {
  const { isDark } = useThemeInfo();
  return (
    <MenuItem onClick={onClick} isDisabled={isLoading} px={4}>
      <HStack spacing={3} opacity={0.7}>
        <Text>{icon}</Text>
        <Text mt={"3px"} fontWeight={"semibold"}>
          {children}
        </Text>
      </HStack>
    </MenuItem>
  );
}

export default CardMenuItem;
