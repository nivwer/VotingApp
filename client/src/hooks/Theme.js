// Hooks.
import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";

export const useThemeInfo = () => {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const ThemeColor = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return { ThemeColor, isDark };
};
