import { NavLink } from "react-router-dom";
import { Flex, Heading, Stack } from "@chakra-ui/react";

import { useThemeInfo } from "../../../hooks/Theme";
import { useGetCategoriesQuery } from "../../../api/pollsAPISlice";
import SidebarCategoryButton from "./SidebarCategoryButton/SidebarCategoryButton";

function SidebarCategories() {
  const { isDark } = useThemeInfo();
  const { data } = useGetCategoriesQuery();

  return (
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
  );
}

export default SidebarCategories;
