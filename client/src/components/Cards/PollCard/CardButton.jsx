// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Button, useColorMode } from "@chakra-ui/react";

// Component.
function CardButton({ children, isLoading }) {
  const { ThemeColor, isDark } = useThemeInfo();
  return (
    <Button flex="1" variant="ghost" isDisabled={isLoading}>
      {children}
    </Button>
  );
}

export default CardButton;
