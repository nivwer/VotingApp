import { Box, Stack, Text } from "@chakra-ui/react";
import { FaHouse } from "react-icons/fa6";
import { useSelector } from "react-redux";

import PollsHome from "./PollsHome/PollsHome";
import { useThemeInfo } from "../../hooks/Theme";
import HomeUserCard from "./HomeUserCard/HomeUserCard";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.session);
  const { isDark } = useThemeInfo();
  return (
    <>
      <Box
        w={"100%"}
        borderBottom={"3px solid"}
        borderRadius={"3px"}
        borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
        mb={4}
      >
        <Stack spacing={4} align={"center"} justify={"center"} h={"200px"} w={"100%"}>
          <Box
            p={8}
            borderRadius={"full"}
            position={"absolute"}
            opacity={isDark ? 0.9 : 0.8}
            bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          >
            <Text children={<FaHouse />} fontSize={"6xl"} />
          </Box>
          <Text mt={28} fontSize={"xl"} fontWeight={"bold"} opacity={isDark ? 0.9 : 0.8}>
            Home
          </Text>
        </Stack>
      </Box>
      {isAuthenticated && <HomeUserCard />}
      <PollsHome />
    </>
  );
}

export default Home;
