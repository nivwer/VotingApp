// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { useProfileByUsernameQuery } from "../../api/profileApiSlice";
// Components.
import ProfileUserPolls from "./ProfileUserPolls";
import ProfileVotedPolls from "./ProfileVotedPolls";
import ProfileTabButton from "./components/ProfileTabButton";
import ProfileLink from "./components/ProfileLink";
import ProfileTags from "./components/ProfileTags";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaRegCalendar, FaLocationDot, FaLink } from "react-icons/fa6";
// Others.
import { format } from "date-fns";
import ProfileSharedPolls from "./ProfileSharedPolls";
import ProfileBookmarkedPolls from "./ProfileBookmarkedPolls";

// Page.
function Profile() {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, token, user } = useSelector(
    (state) => state.session
  );
  const { username } = useParams();
  const [data, setData] = useState(false);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "";
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

  // Joined date.
  const dateJoined = format(
    new Date(profile && profile.date_joined),
    "MMMM yyyy"
  );

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
        {!isLoading && profile && (
          <>
            <Flex spacing="2" flex="1" dir="column" wrap="wrap" align="start">
              <Flex justify="space-between" w="100%" p={5} px={3}>
                {/* Avatar. */}
                <Avatar
                  bg={"gray.400"}
                  size="2xl"
                  src={profile.profile_picture}
                />
                {/* Button to edit the profile. */}
                {isAuthenticated && user.username === profile.username && (
                  <NavLink to={`/settings/profile`}>
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      borderRadius={"full"}
                    >
                      Edit profile
                    </Button>
                  </NavLink>
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
                  <Text opacity={0.5} fontWeight="medium">
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
                  <Stack
                    color={isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`}
                    opacity={ThemeColor === "default" ? 0.6 : 0.8}
                    spacing={0}
                    fontSize={"md"}
                  >
                    {/* Website Link. */}
                    {profile.website_link && (
                      <HStack spacing={1} fontWeight={"semibold"}>
                        <Box
                          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
                          opacity={ThemeColor === "default" ? 1 : 0.8}
                        >
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
                      Joined {dateJoined}
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
      <Box
        bg={isDark ? "black" : "white"}
        zIndex={1000}
        pos={"sticky"}
        top={"64px"}
      >
        <Grid
          templateColumns={
            user.username == username ? "repeat(4, 1fr)" : "repeat(3, 1fr)"
          }
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
          borderBottom={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        >
          <ProfileTabButton tab={tab} username={username}>
            Polls
          </ProfileTabButton>
          <ProfileTabButton tab={tab} value={"votes"} username={username}>
            Votes
          </ProfileTabButton>
          <ProfileTabButton tab={tab} value={"shares"} username={username}>
            Shares
          </ProfileTabButton>
          {user.username == username && (
            <ProfileTabButton tab={tab} value={"bookmarks"} username={username}>
              Bookmarks
            </ProfileTabButton>
          )}
        </Grid>
      </Box>
      {/* Profile Body. */}
      {!isLoading && (
        <Flex>
          {!tab && <ProfileUserPolls id={profile && profile.id} />}
          {tab === "votes" && <ProfileVotedPolls id={profile && profile.id} />}
          {tab === "shares" && (
            <ProfileSharedPolls id={profile && profile.id} />
          )}
          {tab === "bookmarks" && (
            <ProfileBookmarkedPolls id={profile && profile.id} />
          )}
        </Flex>
      )}
    </>
  );
}

export default Profile;
