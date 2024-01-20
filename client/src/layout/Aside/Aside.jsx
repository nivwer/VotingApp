import { Box, Button, Center, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

import { useThemeInfo } from "../../hooks/Theme";
import AsideAbout from "./AsideAbout/AsideAbout";
import AsideExploreUsers from "./AsideExploreUsers/AsideExploreUsers";

function Aside({ section }) {
  const { isDark } = useThemeInfo();
  return (
    <Box pos={"fixed"} w={"343px"} h={"calc(100vh - 64px)"} overflow={"auto"} pb={8}>
      <Stack ml={4} spacing={4}>
        {["main", "user", "settings"].includes(section) && <AsideAbout />}
        {["main", "user"].includes(section) && <AsideExploreUsers />}
      </Stack>
      <Center py={4}>
        <NavLink to={"https://github.com/nivwer"} target="_blank">
          <Button variant={"link"}>
            <Text
              children={"© 2024 nivwer"}
              fontWeight={"medium"}
              fontSize="sm"
              color={isDark ? "gothicPurple.100" : "gothicPurple.900"}
              opacity={isDark ? 0.4 : 0.6}
            />
          </Button>
        </NavLink>
      </Center>
    </Box>
  );
}

export default Aside;
