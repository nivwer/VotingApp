// Hooks.
import { useGetCategoriesDataQuery } from "../../../api/pollApiSlice";
// Components.
import { NavLink } from "react-router-dom";
import CustomSpinner from "../../../components/Spinners/CustomSpinner";
import {
  Button,
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

// Page.
function Categories() {
  const { data, isLoading, isFetching } = useGetCategoriesDataQuery();

  return (
    <>
      {data ? (
        <TableContainer p={"6"}>
          <Table size={"sm"} variant="simple">
            <TableCaption>Categories data.</TableCaption>
            <Thead>
              <Tr>
                <Th>Category</Th>
                <Th isNumeric>Total Polls</Th>
                <Th isNumeric>Total Votes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((category, index) => (
                <Tr key={index}>
                  <Td>
                    <NavLink to={`/categories/${category.value}`}>
                      <Button
                        variant={"ghost"}
                        w={"100%"}
                        justifyContent={"start"}
                        borderRadius={"full"}
                      >
                        {category.text}
                      </Button>
                    </NavLink>
                  </Td>
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
      ) : isLoading || isFetching || !data ? (
        <CustomSpinner />
      ) : (
        data.message
      )}
    </>
  );
}

export default Categories;
