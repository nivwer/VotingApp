// Hooks.
import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "../../../api/profileApiSlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Components.
import UserCard from "../../../components/Cards/UserCard/UserCard";
import CustomSpinner from "../../../components/Spinners/CustomSpinner/CustomSpinner";
import { Box } from "@chakra-ui/react";

// SubComponent ( Results ).
function UsersResults() {
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  const [data, setData] = useState(false);

  const { data: dataUsers, isLoading } = useSearchUsersQuery(data, {
    skip: data ? false : true,
  });

  useEffect(() => {
    if (dataUsers) {
      console.log(dataUsers);
    }
  }, [dataUsers]);

  // Update data to fetchs.
  useEffect(() => {
    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        query: query,
        page: page,
      });
    } else {
      setData({ query: query, page: page });
    }
  }, [query, page, isAuthenticated]);

  return (
    <Box w={"100%"} display={"flex"} flexDir={"column"} alignItems={"center"}>
      {dataUsers && !isLoading
        ? dataUsers.map((user, index) => <UserCard key={index} user={user} />)
        : dataUsers && !isLoading && <div>{dataUsers.message}</div>}
      {(isLoading || !dataUsers) && <CustomSpinner />}
    </Box>
  );
}

export default UsersResults;
