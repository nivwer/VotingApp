import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";

export const useThemeInfo = () => {
  // Theme color.
  const { theme_color: ThemeColor } = useSelector((state) => state.theme);

  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return { ThemeColor, isDark };
};
