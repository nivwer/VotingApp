import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, Center, Stack, Text } from "@chakra-ui/react";
import { FaRegFaceFrown } from "react-icons/fa6";

import { useThemeInfo } from "../../hooks/Theme";
import { useUserProfileByUsernameQuery } from "../../api/accountsAPISlice";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileBody from "./ProfileBody/ProfileBody";

function Profile() {
  const { username } = useParams();
  const { isAuthenticated } = useSelector((state) => state.session);
  const { isDark } = useThemeInfo();
  const [dataQuery, setDataQuery] = useState(false);
  const [profile, setProfile] = useState(null);
  const { data, status, isLoading, isFetching, isError, error } = useUserProfileByUsernameQuery(
    dataQuery,
    {
      skip: dataQuery ? false : true,
    }
  );

  useEffect(() => {
    setProfile(null);
    setDataQuery({ username: username });
  }, [username, isAuthenticated]);

  useEffect(() => {
    if (data && !isFetching && !isLoading && data.profile.username === username)
      setProfile(data.profile);
  }, [data, status]);

  return (
    <Stack spacing={4}>
      {/* Profile Header. */}
      <Box
        w={"100%"}
        minHeight={"304px"}
        bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        py={6}
        px={7}
        borderRadius={{ base: 0, sm: "3xl" }}
        overflow={"hidden"}
        boxShadow={"none"}
      >
        {!isLoading && !isFetching && profile && profile.username === username && (
          <ProfileHeader profile={profile} />
        )}

        {isError && (
          <Center opacity={isDark ? 0.7 : 0.5} w={"100%"} h={"100%"} minHeight={"250px"}>
            <Stack>
              <Text children={error.data} fontWeight={"semibold"} />
              <Center fontSize={"4xl"}>
                <Box children={error.status === 404 && <FaRegFaceFrown />} />
              </Center>
            </Stack>
          </Center>
        )}
      </Box>

      {/* Profile Body. */}
      <Box w={"100%"} color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}>
        {!isLoading && !isFetching && profile && profile.username === username && (
          <ProfileBody profile={profile} isLoading={isLoading} username={username} />
        )}
      </Box>
    </Stack>
  );
}

export default Profile;
