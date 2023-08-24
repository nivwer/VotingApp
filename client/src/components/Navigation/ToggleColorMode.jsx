// Hooks.
import { useSelector } from "react-redux";
// Components.
import { Button, useColorMode } from "@chakra-ui/react";
// Icons.
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// Component.
function ToggleColorMode() {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <>
      <Button
        size="sm"
        colorScheme={color}
        variant={"ghost"}
        onClick={() => toggleColorMode()}
      >
        {colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </>
  );
}

export default ToggleColorMode;
