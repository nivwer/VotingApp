// Hooks.
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../../hooks/Theme";
import {
  useGetCategoriesQuery,
  useGetPollsCategoryQuery,
} from "../../../../api/pollApiSlice";
// Components.
import Pagination from "../../../../components/Pagination/Pagination";
import PollCard from "../../../../components/Cards/PollCard/PollCard";
import { Box, Stack, Text } from "@chakra-ui/react";
// Icons.
import { FaHashtag } from "react-icons/fa6";
// Utils.
import categoryIcons from "../../../../utils/categoryIcons";

// Page.
function CategoryPolls() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { category } = useParams();
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(false);

  const { data } = useGetCategoriesQuery();

  // Update data to fetchs.
  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated
        ? { headers: { Authorization: `Token ${token}` } }
        : {};

      setDataQuery({ ...headers, category: category, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);

  // Reset the values.
  useEffect(() => {
    setResetValues(true);
  }, [category, isAuthenticated]);

  useEffect(() => {
    if (data) {
      const categoryData = data.list.find((item) => item.value === category);
      setCurrentCategory(categoryData);
    }
  }, [category, data]);

  return (
    <>
      <Box
        w={"100%"}
        opacity={0.9}
        borderBottom={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.300"}
      >
        <Stack
          spacing={4}
          align={"center"}
          justify={"center"}
          h={"200px"}
          w={"100%"}
        >
          {currentCategory && currentCategory.value === category && (
            <>
              <Box p={"6"} borderRadius={"full"} position={"absolute"}>
                <Text fontSize={"6xl"}>
                  {categoryIcons[currentCategory.value] || <FaHashtag />}
                </Text>
              </Box>
              <Text mt={28} fontSize={"xl"} fontWeight={"bold"}>
                {currentCategory.text}
              </Text>
            </>
          )}
        </Stack>
      </Box>

      {currentCategory && currentCategory.value === category && (
        <Pagination
          Card={PollCard}
          usePageQuery={useGetPollsCategoryQuery}
          dataQuery={dataQuery}
          reset={{ resetValues: resetValues, setResetValues: setResetValues }}
        />
      )}
    </>
  );
}

export default CategoryPolls;
