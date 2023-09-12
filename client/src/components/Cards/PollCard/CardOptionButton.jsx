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
      variant="outline"
      colorScheme={"default"}
      borderRadius={"full"}
      color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.400"}
      opacity={0.8}
      justifyContent="start"
      wordBreak={"break-all"}
      pl={"5"}
    >
      {children}
    </Button>
  );
}

export default CardOptionButton;
