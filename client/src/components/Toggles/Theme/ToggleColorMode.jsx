// Components.
import { IconButton, useColorMode } from "@chakra-ui/react";
// Icons.
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// Component.
function ToggleColorMode() {
  // Theme mode.
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <>
      <IconButton
        onClick={() => toggleColorMode()}
        colorScheme={"default"}
        variant={"ghost"}
        size="sm"
        borderRadius={"full"}
        opacity={isDark ? 1 : 0.6}
      >
        {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </>
  );
}

export default ToggleColorMode;
