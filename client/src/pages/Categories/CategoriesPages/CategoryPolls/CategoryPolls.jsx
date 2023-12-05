import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useThemeInfo } from "../../../../hooks/Theme";
import { useGetCategoriesQuery, useGetPollsCategoryQuery } from "../../../../api/pollApiSlice";
import Pagination from "../../../../components/Pagination/Pagination";
import PollCard from "../../../../components/Cards/PollCard/PollCard";
import { Box, Stack, Text } from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa6";
import categoryIcons from "../../../../utils/icons/categoryIcons";

// Page.
function CategoryPolls() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { category } = useParams();
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const { data } = useGetCategoriesQuery();

  // Update data to fetchs.
  useEffect(() => {
    if (resetValues) {
      const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
      setDataQuery({ ...headers, category: category, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);

  useEffect(() => {
    setCurrentCategory(null);
    setResetValues(true);
  }, [category, isAuthenticated]);

  useEffect(() => {
    if (data && !resetValues) setCurrentCategory(data.list.find((item) => item.value === category));
  }, [data, resetValues]);

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
          {currentCategory && currentCategory.value === category && (
            <>
              <Box
                p={8}
                borderRadius={"full"}
                position={"absolute"}
                opacity={isDark ? 0.9 : 0.8}
                bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
              >
                <Text fontSize={"6xl"}>
                  {categoryIcons[currentCategory.value] || <FaHashtag />}
                </Text>
              </Box>
              <Text mt={28} fontSize={"xl"} fontWeight={"bold"} opacity={isDark ? 0.9 : 0.8}>
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
