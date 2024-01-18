import { Box, Grid, GridItem } from "@chakra-ui/react";

import { useThemeInfo } from "../../hooks/Theme";
import SidebarCategories from "./SidebarCategories/SidebarCategories";
import SidebarSettings from "./SidebarSettings/SidebarSettings";

function Sidebar({ section }) {
  const { isDark } = useThemeInfo();

  return (
    <Box pos={"fixed"} w={"295px"} h={"96%"}>
      <Grid gridTemplateRows={"1fr 70px"} gridTemplateColumns={"100%"} gap="1" h={"100%"}>
        <GridItem
          overflow={"auto"}
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          mr={4}
          borderRadius={"3xl"}
          boxShadow={"base"}
          py={6}
        >
          {["main", "user"].includes(section) && <SidebarCategories />}
          {["settings"].includes(section) && <SidebarSettings />}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Sidebar;
