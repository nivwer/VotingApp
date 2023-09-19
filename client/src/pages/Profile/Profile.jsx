// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useGetProfileQuery } from "../../api/profileApiSlice";
// Styles.
import { getProfileStyles } from "./ProfileStyles";
// Components.
import ProfileModal from "./components/ProfileModal/ProfileModal";
import ProfileLink from "./components/ProfileLink";
import ProfileTags from "./components/ProfileTags";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaRegCalendar, FaLocationDot, FaLink } from "react-icons/fa6";

// Page.
function Profile() {
  const { isDark, ThemeColor } = useThemeInfo();
  const styles = getProfileStyles(isDark, ThemeColor);
  const session = useSelector((state) => state.session);
  const { username } = useParams();
  const [data, setData] = useState(false);

  // Query to get User Profile.
  const [profile, setProfile] = useState(null);
  const { data: dataProfile } = useGetProfileQuery(data, {
    skip: data ? false : true,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: { Authorization: `Token ${session.token}` },
        username: username,
      });
    } else {
      setData({ username: username });
    }
  }, [username, session.token]);

  // Load Profile.
  useEffect(() => {
    dataProfile && setProfile(dataProfile.profile);
  }, [dataProfile]);

  return (
    <>
      {/* Profile Header. */}
      <Box {...styles.header.content}>
        {profile && (
          <>
            <Flex {...styles.header.container}>
              <Flex {...styles.header.flex}>
                {/* Avatar. */}
                <Avatar
                  bg={"gray.400"}
                  size="2xl"
                  src={profile.profile_picture}
                />
                {/* Button to edit the profile. */}
                {session.token &&
                  session.user.username === profile.username && (
                    <ProfileModal profile={profile} />
                  )}
              </Flex>

              <Stack spacing={4}>
                <Box>
                  <HStack spacing={2}>
                    {/* Profile name. */}
                    <Heading opacity={isDark ? 1 : 0.9} size="md">
                      {profile.profile_name}
                    </Heading>
                    {/* Pronouns. */}
                    <Text opacity={0.5} fontWeight="medium">
                      {profile.pronouns}
                    </Text>
                  </HStack>
                  {/* Username. */}
                  <Text opacity={0.5} fontWeight="normal">
                    @{profile.username}
                  </Text>
                </Box>
                <Stack spacing={2}>
                  {/* Biography. */}
                  {profile.bio && (
                    <Text opacity={0.9} fontWeight="medium">
                      {profile.bio}
                    </Text>
                  )}

                  {/* Links. */}
                  <Stack {...styles.header.stack_links}>
                    {/* Website Link. */}
                    {profile.website_link && (
                      <HStack spacing={1} fontWeight={"semibold"}>
                        <Box {...styles.header.box_icon}>
                          <FaLink />
                        </Box>
                        <ProfileLink link={profile.website_link} />
                      </HStack>
                    )}
                    {/* Social Links. */}
                    {(profile.social_link_one ||
                      profile.social_link_two ||
                      profile.social_link_three) && (
                      <HStack spacing={2}>
                        <ProfileLink link={profile.social_link_one} />
                        <ProfileLink link={profile.social_link_two} />
                        <ProfileLink link={profile.social_link_three} />
                      </HStack>
                    )}
                  </Stack>

                  {/* Tags. */}
                  <HStack spacing={5}>
                    {/* Joined date. */}
                    <ProfileTags icon={<FaRegCalendar />}>
                      Joined September 2022
                    </ProfileTags>
                    {/* Location. */}
                    {profile.country && (
                      <ProfileTags icon={<FaLocationDot />}>
                        {profile.country}
                        {profile.city && ` (${profile.city})`}
                      </ProfileTags>
                    )}
                  </HStack>
                </Stack>
              </Stack>
            </Flex>
          </>
        )}
      </Box>

      {/* Profile Tabs. */}
      <Grid templateColumns="repeat(2, 1fr)" {...styles.body.tab_list}>
        <GridItem>
          <NavLink to={`/${username}`}>
            <Button w={"100%"} variant={"ghost"}>
              Polls
            </Button>
          </NavLink>
        </GridItem>
        <GridItem>
          <NavLink to={`/${username}/votes`}>
            <Button w={"100%"} variant={"ghost"}>
              Votes
            </Button>
          </NavLink>
        </GridItem>
      </Grid>

      {/* Profile Body. */}
      <Flex>
        <Outlet />
      </Flex>
    </>
  );
}

export default Profile;
