import { useEffect, useState } from "react";
import { useExploreUsersQuery } from "../../api/accountsAPISlice";
import { useSelector } from "react-redux";
import UserCard from "../../components/Cards/UserCard/UserCard";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useThemeInfo } from "../../hooks/Theme";
import { NavLink } from "react-router-dom";

function Aside() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const { data, error, isLoading, isFetching, status } = useExploreUsersQuery(
    { ...dataQuery, page: 1, page_size: 3 },
    { skip: dataQuery ? false : true }
  );

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { Authorization: `Token ${token}` } } : {};
    setDataQuery({ ...headers });
  }, [isAuthenticated]);

  return (
    <Box pos={"fixed"} w={"343px"} h={"calc(100vh - 64px)"}>
      <Stack mx={4}>
        <Box
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          borderRadius={"3xl"}
          w={"100%"}
          py={6}
          boxShadow={"base"}
        >
          <Box px={8} py={1}>
            <NavLink>
              <Text fontWeight={"black"} fontSize={"md"} opacity={0.9}>
                Explore users
              </Text>
            </NavLink>
          </Box>
          <Stack spacing={0}>
            {data &&
              data.items.map((item, index) => (
                <UserCard key={index} item={item} variant="unstyled" hasBio={false} />
              ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default Aside;
