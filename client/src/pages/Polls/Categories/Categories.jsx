// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useGetCategoriesDataQuery } from "../../../api/pollApiSlice";
// Components.
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CustomSpinner from "../../../components/Spinners/CustomSpinner";

// Page.
function Categories() {
  const { isDark, ThemeColor } = useThemeInfo();
  const {
    data: dataCategories,
    isLoading,
    isFetching,
  } = useGetCategoriesDataQuery();

  return (
    <>
      {dataCategories ? (
        <TableContainer p={"5"}>
          <Table size={"md"} variant="simple">
            <TableCaption>Categories data.</TableCaption>
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th isNumeric>Total Polls</Th>
                <Th isNumeric>Total Votes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dataCategories.map((category, index) => (
                <Tr key={index}>
                  <Td>{category.text}</Td>
                  <Td isNumeric>{category.total_polls}</Td>
                  <Td isNumeric>{category.total_polls}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Category</Th>
                <Th isNumeric>Total Polls</Th>
                <Th isNumeric>Total Votes</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      ) : isLoading || isFetching || !dataCategories ? (
        <CustomSpinner />
      ) : (
        dataCategories.message
      )}
    </>
  );
}

export default Categories;
