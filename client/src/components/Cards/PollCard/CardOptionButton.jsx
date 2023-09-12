// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Button } from "@chakra-ui/react";

// Component.
function CardOptionButton({ value, children, vote, setVote, isLoading }) {
  const { ThemeColor, isDark } = useThemeInfo();
  return (
    <Button
      onClick={() => {
        setVote(value);
      }}
      isDisabled={isLoading}
      variant={vote === value ? "solid" : "outline"}
      colorScheme={vote === value ? ThemeColor : "default"}
      borderRadius={"full"}
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
