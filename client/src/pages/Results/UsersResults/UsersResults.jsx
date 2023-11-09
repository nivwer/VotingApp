// Hooks.
import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "../../../api/profileApiSlice";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
// Components.
import UserCard from "../../../components/Cards/UserCard/UserCard";
import CustomSpinner from "../../../components/Spinners/CustomSpinner/CustomSpinner";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
// Icons.
import { FaRegFaceFrown, FaRegFaceMehBlank } from "react-icons/fa6";
import { useThemeInfo } from "../../../hooks/Theme";

// SubComponent ( Results ).
function UsersResults() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const type = searchParams.get("type") || "";

  const [data, setData] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(false);

  const {
    data: dataUsers,
    isLoading,
    isFetching,
  } = useSearchUsersQuery(data, {
    skip: data ? false : true,
  });

  // Reset values.
  useEffect(() => {
    setPage(1);
    setUsers([]);
    setMessage(false);
  }, [query, type]);

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

  // Scroll event.
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 30 &&
      !isFetching &&
      dataUsers &&
      dataUsers.paginator.has_next
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dataUsers, isFetching]);

  // Add the users in the users state.
  useEffect(() => {
    if (dataUsers) {
      dataUsers.users && setUsers([...users, ...dataUsers.users]);
      dataUsers.message && setMessage(true);
      !dataUsers.paginator.has_next && setMessage(true);
    }
  }, [dataUsers]);

  // Load more items.
  useEffect(() => {
    if (
      document.getElementById("container").clientHeight < window.innerHeight &&
      !isFetching &&
      !isLoading &&
      dataUsers &&
      dataUsers.paginator.has_next
    ) {
      setPage(page + 1);
    }
  }, [users]);

  return (
    <Box
      id="container"
      w={"100%"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
    >
      {users &&
        users.map((user, index) => <UserCard key={index} user={user} />)}

      <Box h={"100px"} w={"100%"}>
        {!users || !message ? (
          <CustomSpinner
            opacity={
              window.innerHeight + window.scrollY <=
                document.body.scrollHeight - 30 ||
              isLoading ||
              isFetching ||
              !users
                ? 0.7
                : 0
            }
          />
        ) : (
          <Center opacity={isDark ? 0.7 : 0.5} w={"100%"} h={"100%"}>
            <Stack>
              <Text fontWeight={"semibold"}>
                {dataUsers && dataUsers.message
                  ? dataUsers.message
                  : "No more results"}
              </Text>
              <Center fontSize={"3xl"}>
                <Box>
                  {dataUsers && dataUsers.message ? (
                    <FaRegFaceFrown />
                  ) : (
                    <FaRegFaceMehBlank />
                  )}
                </Box>
              </Center>
            </Stack>
          </Center>
        )}
      </Box>
    </Box>
  );
}

export default UsersResults;
