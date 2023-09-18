// Hooks.
import { useEffect, useState } from "react";
import { useGetPollCategoriesQuery } from "../../../api/pollApiSlice";
// Components.
import PollModal from "../../Modals/PollModal/PollModal";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
} from "@chakra-ui/react";

// Component.
function SideBar({ section }) {
  // Request to get poll categories.
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetPollCategoriesQuery();
  // Is loading.
  const isLoading = isCategoriesLoading;

  // Poll categories.
  const [categories, setCategories] = useState(false);

  // Load poll categories.
  useEffect(() => {
    categoriesData ? setCategories(categoriesData.list) : setCategories(false);
  }, [categoriesData]);

  return (
    <Box pos={"fixed"} w={"295px"} h={"calc(100vh - 64px)"}>
      <Grid
        templateAreas={`"header" "main" "footer"`}
        gridTemplateRows={"245px 1fr 100px"}
        gridTemplateColumns={"95%"}
        gap="1"
        h={"100%"}
      >
        <GridItem bg="orange.300" area={"header"} overflow={"auto"}>
          Header
          {/* User polls voted. */}
          <Stack bg={"red"}>
            <NavLink>
              <Button>Button1</Button>
            </NavLink>
            <NavLink>
              <Button>Button1</Button>
            </NavLink>
            <NavLink>
              <Button>Button1</Button>
            </NavLink>
            <NavLink>
              <Button>Button1</Button>
            </NavLink>
          </Stack>
        </GridItem>
        <GridItem area={"main"} overflow={"auto"}>
          {/* Categories */}
          <Flex
            zIndex={"100"}
            justifyContent={"center"}
            pos={"sticky"}
            top={"0"}
            w={"100%"}
            bg={"black"}
            p={"3"}
          >
            <Heading w={"90%"} fontSize={"lg"}>
              Categories
            </Heading>
          </Flex>
          <Flex justifyContent={"center"}>
            <Stack w={"85%"} spacing={0}>
              {categories &&
                categories.map((category, index) => (
                  <NavLink key={index}>
                    <Button
                      variant={"ghost"}
                      justifyContent={"start"}
                      w={"100%"}
                      size={"sm"}
                    >
                      {category.text}
                    </Button>
                  </NavLink>
                ))}
            </Stack>
          </Flex>
        </GridItem>
        <GridItem bg="blue.300" area={"footer"}>
          Footer
          {/* New Poll button. */}
          {/* <Box bg={"yellow"} h={"200px"} overflow={"auto"}>
            <PollModal />
          </Box> */}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default SideBar;
