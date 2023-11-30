// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useProfileByUsernameQuery } from "../../api/profileApiSlice";
// Components.
import { Box, Stack } from "@chakra-ui/react";
// SubComponents.
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileBody from "./ProfileBody/ProfileBody";

// Page.
function Profile() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { username } = useParams();
  const [dataQuery, setDataQuery] = useState(false);

  // Query to get User Profile.
  const [profile, setProfile] = useState(null);
  const { data, status, isLoading, isFetching } = useProfileByUsernameQuery(
    dataQuery,
    { skip: dataQuery ? false : true }
  );

  // Update data to fetchs.
  useEffect(() => {
    setProfile(null);
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataQuery({ ...headers, username: username });
  }, [username, isAuthenticated]);

  // Load Profile.
  useEffect(() => {
    data &&
      !isFetching &&
      !isLoading &&
      data.profile.username === username &&
      setProfile(data.profile);
  }, [data, status]);

  return (
    <>
      <Stack spacing={4}>
        {/* Profile Header. */}
        <Box
          w={"100%"}
          minHeight={"304px"}
          bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
          py={6}
          px={7}
          borderRadius={{ base: 0, md: "3xl" }}
          overflow={"hidden"}
          boxShadow={"md"}
        >
          {!isLoading &&
            !isFetching &&
            profile &&
            profile.username === username && (
              <ProfileHeader profile={profile} />
            )}
        </Box>

        {/* Profile Body. */}
        <Box w={"100%"} color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}>
          {!isLoading &&
            !isFetching &&
            profile &&
            profile.username === username && (
              <ProfileBody
                profile={profile}
                isLoading={isLoading}
                username={username}
              />
            )}
        </Box>
      </Stack>
    </>
  );
}

export default Profile;
