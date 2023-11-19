// Hooks.
import { useGetCategoriesQuery } from "../../../api/pollApiSlice";
// Components.
import PollModal from "../../Modals/PollModal/PollModal";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useThemeInfo } from "../../../hooks/Theme";
// Icons.
import { FaPlus, FaHouse, FaSquarePollHorizontal } from "react-icons/fa6";

// Component.
function SideBar({ section }) {
  const { isDark, ThemeColor } = useThemeInfo();

  // Poll Modal.
  const disclosure = useDisclosure();

  // Request to get poll categories.
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  // Is loading.
  const isLoading = isCategoriesLoading;

  return (
    <Box pos={"fixed"} w={"295px"} h={"calc(100vh - 64px)"}>
      <Grid
        gridTemplateRows={"1fr 70px"}
        gridTemplateColumns={"100%"}
        gap="1"
        h={"100%"}
      >
        <GridItem overflow={"auto"}>
          {/* Categories */}
          <Flex
            zIndex={"100"}
            opacity={0.9}
            justify={"center"}
            w={"100%"}
            bg={isDark ? "black" : "white"}
            p={3}
            py={2}
            mt={5}
          >
            <Heading w={"87%"} fontSize={"lg"}>
              <NavLink to={"/categories"}>Categories</NavLink>
            </Heading>
          </Flex>
          <Flex opacity={isDark ? 0.8 : 0.6} justify={"center"}>
            <Stack w={"82%"} spacing={0} fontWeight={"semibold"}>
              {categoriesData &&
                categoriesData.list.map((category, index) => (
                  <NavLink to={`/categories/${category.value}`} key={index}>
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
          <Flex
            h={"100%"}
            pl={5}
            pr={8}
            justify={"space-between"}
            align={"center"}
            borderTopLeftRadius={"3xl"}
            border={"1px solid"}
            borderRight={"0px solid"}
            borderColor={isDark ? "whiteAlpha.200" : "blackAlpha.200"}
          >
            <HStack opacity={isDark ? 0.9 : 0.8} spacing={1}>
              <NavLink to={"/home"}>
                <IconButton
                  icon={<FaHouse />}
                  variant={"ghost"}
                  borderRadius="full"
                  size={"md"}
                  fontSize={"xl"}
                />
              </NavLink>
              <NavLink to={"categories"}>
                <IconButton
                  icon={<FaSquarePollHorizontal />}
                  variant={"ghost"}
                  borderRadius="full"
                  size={"md"}
                  fontSize={"xl"}
                />
              </NavLink>
            </HStack>

            <IconButton
              onClick={disclosure.onOpen}
              icon={<FaPlus />}
              colorScheme={ThemeColor}
              variant={"solid"}
              borderRadius={"full"}
              size={"md"}
              opacity={0.9}
            />
            <PollModal disclosure={disclosure} />
          </Flex>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default SideBar;
