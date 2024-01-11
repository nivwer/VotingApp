import { useThemeInfo } from "../../hooks/Theme";
import { useGetCategoriesQuery } from "../../api/pollsAPISlice";
import { NavLink } from "react-router-dom";
import { Box, Flex, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
import SidebarCategoryButton from "./SidebarCategoryButton/SidebarCategoryButton";
import SidebarSettingButton from "./SidebarSettingButton/SidebarSettingButton";
import { FaPaintbrush, FaUserGear, FaUserPen } from "react-icons/fa6";

function Sidebar({ section }) {
  const { isDark } = useThemeInfo();
  const { data } = useGetCategoriesQuery();

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
          {(section === "main" || section === "user") && (
            <>
              <Flex zIndex={"100"} opacity={0.9} justify={"center"} w={"100%"} px={3} py={1}>
                <Heading w={"87%"} fontSize={"lg"}>
                  <NavLink children={"Categories"} to={"/categories"} />
                </Heading>
              </Flex>
              <Flex mt={"2px"} opacity={isDark ? 0.8 : 0.6} justify={"center"}>
                <Stack w={"87%"} spacing={0} fontWeight={"black"}>
                  {data &&
                    data.list.map((category, index) => (
                      <SidebarCategoryButton key={index} category={category} />
                    ))}
                </Stack>
              </Flex>
            </>
          )}

          {section === "settings" && (
            <>
              <Flex zIndex={"100"} opacity={0.9} justify={"center"} w={"100%"} px={3} py={1}>
                <Heading w={"87%"} fontSize={"lg"}>
                  <NavLink children={"Settings"} to={"/settings"} />
                </Heading>
              </Flex>
              <Flex mt={"2px"} opacity={isDark ? 0.8 : 0.6} justify={"center"}>
                <Stack w={"87%"} spacing={0} fontWeight={"black"}>
                  <SidebarSettingButton children={"Account"} icon={<FaUserGear />} to={"account"} />
                  <SidebarSettingButton children={"Profile"} icon={<FaUserPen />} to={"profile"} />
                  <SidebarSettingButton children={"Theme"} icon={<FaPaintbrush />} to={"theme"} />
                </Stack>
              </Flex>
            </>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Sidebar;
