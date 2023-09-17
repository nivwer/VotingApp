// Hooks.
import { useThemeInfo } from "../hooks/Theme";
// Components.
import { Box, Stack } from "@chakra-ui/react";
// Icons

function Home() {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <Box
      w={"100%"}
      bg={isDark ? `black` : `${ThemeColor}.bg-l-p`}
      outline={isDark ? "1px solid" : "2px solid"}
      outlineColor={isDark ? `${ThemeColor}.border-d` : `${ThemeColor}.600`}
      borderRadius="14px"
      pt={"20px"}
      pb={"20px"}
    >
      <Stack w={"100%"}></Stack>
    </Box>
  );
}

export default Home;
