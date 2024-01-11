import { useThemeInfo } from "../../hooks/Theme";
import { useGetCategoriesQuery } from "../../api/pollsAPISlice";
import { Box, Stack } from "@chakra-ui/react";
import CustomSpinner from "../../components/Spinners/CustomSpinner/CustomSpinner";
import CategoriesLinkButton from "./CategoriesLinkButton/CategoriesLinkButton";

function Categories() {
  const { isDark } = useThemeInfo();
  const { data, isLoading, isFetching } = useGetCategoriesQuery();

  return (
    <>
      {data && (
        <Box w={"100%"} py={5} opacity={isDark ? 0.9 : 0.6}>
          <Stack spacing={0}>
            {data &&
              data.list.map((category, index) => (
                <CategoriesLinkButton key={index} category={category} />
              ))}
          </Stack>
        </Box>
      )}
      {isLoading || isFetching || (!data && <CustomSpinner />)}
    </>
  );
}

export default Categories;
