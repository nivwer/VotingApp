// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Button, useColorMode } from "@chakra-ui/react";

// Component.
function CardOptionButton({ children }) {
  const { ThemeColor, isDark } = useThemeInfo();
  return (
    <Button
      variant="ghost"
      colorScheme={ThemeColor}
      bg={isDark ? `${ThemeColor}.bg-d-dimmed` : `${ThemeColor}.bg-l-dimmed`}
      color={isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`}
      opacity={isDark ? 0.8 : 0.6}
      justifyContent="start"
    >
      {children}
    </Button>
  );
}

export default CardOptionButton;
