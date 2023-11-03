// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useProfileByUsernameQuery } from "../../api/profileApiSlice";
// Components.
import { Box } from "@chakra-ui/react";
// SubComponents.
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ProfileBody from "./ProfileBody/ProfileBody";

// Page.
function Profile() {
  const { isDark } = useThemeInfo();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { username } = useParams();
  const [data, setData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Query to get User Profile.
  const [profile, setProfile] = useState(null);
  const { data: dataProfile } = useProfileByUsernameQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    setIsLoading(true);
    if (isAuthenticated) {
      setData({
        headers: { Authorization: `Token ${token}` },
        username: username,
      });
    } else {
      setData({ username: username });
    }
  }, [username, isAuthenticated]);

  // Load Profile.
  useEffect(() => {
    dataProfile && setProfile(dataProfile.profile);
    setIsLoading(false);
  }, [dataProfile]);

  return (
    <>
      {/* Profile Header. */}
      <Box
        w={"100%"}
        minHeight={"328px"}
        p={"7"}
        pb={"10"}
        bg={isDark ? "black" : "white"}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        overflow={"hidden"}
      >
        {!isLoading && profile && <ProfileHeader profile={profile} />}
      </Box>
      {/* Profile Body. */}
      <ProfileBody
        profile={profile}
        isLoading={isLoading}
        username={username}
      />
    </>
  );
}

export default Profile;
