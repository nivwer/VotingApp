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
import { useThemeInfo } from "../../../hooks/Theme";

// Component.
function SideBar({ section }) {
  const { isDark, ThemeColor } = useThemeInfo();
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
        gridTemplateRows={"80px 1fr 80px"}
        gridTemplateColumns={"95%"}
        gap="1"
        h={"100%"}
      >
        <GridItem>
          {/* New Poll button. */}
          <Flex h={"100%"} justify={"center"} align={"center"}>
            <PollModal
              buttonStyles={{
                size: "lg",
                colorScheme: ThemeColor,
                variant: "outline",
                w: "90%",
                borderRadius: "2xl",
              }}
            />
          </Flex>
        </GridItem>
        <GridItem overflow={"auto"}>
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
                  <NavLink
                    to={`/results/?category=${category.value}`}
                    key={index}
                  >
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
        <GridItem>
          <Flex h={"100%"} justify={"center"} align={"center"}>
            <PollModal
              buttonStyles={{
                size: "lg",
                colorScheme: ThemeColor,
                variant: "solid",
                w: "70%",
                borderRadius: "2xl",
              }}
            />
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default SideBar;
