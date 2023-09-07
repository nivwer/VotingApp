// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Button } from "@chakra-ui/react";

// Component.
function CardOptionButton({ children, isLoading }) {
  const { ThemeColor, isDark } = useThemeInfo();
  return (
    <Button
      isDisabled={isLoading}
      variant="ghost"
      colorScheme={ThemeColor}
      bg={isDark ? `${ThemeColor}.bg-d-dimmed` : `${ThemeColor}.bg-l-dimmed`}
      color={isDark ? `${ThemeColor}.text-d-p` : `${ThemeColor}.900`}
      opacity={isDark ? 0.8 : 0.6}
      justifyContent="start"
      wordBreak={"break-all"}
    >
      {children}
    </Button>
  );
}

export default CardOptionButton;
