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
        size="sm"
        colorScheme={"default"}
        opacity={isDark ? 1 : 0.6}
        variant={"ghost"}
        borderRadius={"full"}
        onClick={() => toggleColorMode()}
      >
        {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </>
  );
}

export default ToggleColorMode;
