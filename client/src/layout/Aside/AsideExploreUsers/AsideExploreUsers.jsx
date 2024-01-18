import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Stack, Text } from "@chakra-ui/react";
import Cookies from "js-cookie";

import { useThemeInfo } from "../../../hooks/Theme";
import { useExploreUsersQuery } from "../../../api/accountsAPISlice";
import UserCard from "../../../components/Cards/UserCard/UserCard";

function AsideExploreUsers() {
  const csrftoken = Cookies.get("csrftoken");
  const { isDark } = useThemeInfo();
  const { isAuthenticated } = useSelector((state) => state.session);
  const [dataQuery, setDataQuery] = useState(false);
  const { data } = useExploreUsersQuery(
    { ...dataQuery, page: 1, page_size: 3 },
    { skip: dataQuery ? false : true }
  );

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
    setDataQuery({ ...headers });
  }, [isAuthenticated]);

  return (
    <Box pos={"fixed"} w={"343px"} h={"calc(100vh - 64px)"}>
      <Stack ml={4}>
        <Box
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          borderRadius={"3xl"}
          w={"100%"}
          py={6}
          boxShadow={"base"}
          minH={"200px"}
        >
          {data && (
            <>
              <Box px={8} py={1}>
                <NavLink to={"/search?type=users"}>
                  <Text children="Explore users" fontWeight="black" fontSize="md" opacity={0.9} />
                </NavLink>
              </Box>
              <Stack spacing={0}>
                {data.items.map((item, index) => (
                  <UserCard key={index} item={item} variant="unstyled" hasBio={false} />
                ))}
              </Stack>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default AsideExploreUsers;
