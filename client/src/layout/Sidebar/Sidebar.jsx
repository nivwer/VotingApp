// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useGetCategoriesQuery } from "../../api/pollApiSlice";
// Components.
import { NavLink } from "react-router-dom";
import { Box, Flex, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
// SubComponent.
import SidebarCategoryButton from "./SidebarCategoryButton/SidebarCategoryButton";

// Component.
function Sidebar({ section }) {
  const { isDark } = useThemeInfo();

  // Request to get poll categories.
  const { data, isLoading } = useGetCategoriesQuery();

  return (
    <Box
      pos={"fixed"}
      w={"295px"}
      //  h={"calc(100vh - 64px)"}
      h={"96%"}
    >
      <Grid
        gridTemplateRows={"1fr 70px"}
        gridTemplateColumns={"100%"}
        gap="1"
        h={"100%"}
      >
        <GridItem
          overflow={"auto"}
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          mr={4}
          borderRadius={"3xl"}
          boxShadow={"base"}
          py={6}
        >
          {/* Categories */}
          <Flex
            zIndex={"100"}
            opacity={0.9}
            justify={"center"}
            w={"100%"}
            px={3}
            py={1}
          >
            <Heading w={"87%"} fontSize={"lg"}>
              <NavLink to={"/categories"}>Categories</NavLink>
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
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Sidebar;
