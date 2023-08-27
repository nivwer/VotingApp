// Hooks.
import { useSelector } from "react-redux";
// Components.
import PollCard from "../components/Cards/PollCard";
import { useColorMode, Box, Container, Stack } from "@chakra-ui/react";
// Icons

function Home() {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <>
        <Box
          w={"100%"}
          bg={isDark ? `black` : `${color}.bg-l-p`}
          outline={isDark ? "1px solid" : "2px solid"}
          outlineColor={isDark ? `${color}.border-d` : `${color}.600`}
          borderRadius="14px"
          pt={"20px"}
          pb={"20px"}
        >
          <Stack w={"100%"}>
            <PollCard />
          </Stack>
        </Box>
    </>
  );
}

export default Home;
