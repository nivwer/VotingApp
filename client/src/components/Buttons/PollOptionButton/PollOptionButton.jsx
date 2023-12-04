// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { Button } from "@chakra-ui/react";

// Component.
function PollOptionButton(props) {
  const { isDark } = useThemeInfo();
  return (
    <Button
      variant={"solid"}
      fontWeight={"medium"}
      outline={"1px solid"}
      borderRadius={"3xl"}
      color={isDark ? "whiteAlpha.800" : "blackAlpha.700"}
      outlineColor={isDark ? `gothicPurpleAlpha.300` : `gothicPurpleAlpha.500`}
      bg={"transparent"}
      _hover={{ bg: "transparent" }}
      _focus={{ bg: "transparent" }}
      focusBorderColor={
        isDark ? `gothicPurpleAlpha.400` : `gothicPurpleAlpha.600`
      }
      {...props}
    />
  );
}

export default PollOptionButton;
