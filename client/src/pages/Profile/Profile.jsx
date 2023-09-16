// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetUserPollsQuery } from "../../api/pollApiSlice";
import {
  useGetProfileQuery,
  useReadProfileQuery,
} from "../../api/profileApiSlice";
// Actions.
import { updateProfile } from "../../features/auth/sessionSlice";
// Styles.
import { getProfileStyles } from "./ProfileStyles";
// Components.
import ProfileModal from "./components/ProfileModal/ProfileModal";
import ProfileLink from "./components/ProfileLink";
import ProfileTags from "./components/ProfileTags";
import ProfileSpinner from "./components/ProfileSpinner";
import PollCard from "../../components/Cards/PollCard/PollCard";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaRegCalendar, FaLocationDot, FaLink } from "react-icons/fa6";

// Page.
function Profile() {
  const dispatch = useDispatch();
  const { isDark, ThemeColor } = useThemeInfo();
  const styles = getProfileStyles(isDark, ThemeColor);
  // Session.
  const session = useSelector((state) => state.session);
  // Username param.
  const { username } = useParams();

  // Querys or mutations.
  const [data, setData] = useState(false);
  const [skip, setSkip] = useState(true);
  const [selfProfileSkip, setSelfProfileSkip] = useState(true);

  // User Profile.
  const [profile, setProfile] = useState(null);
  const { data: dataProfile, isLoading: isProfileLoading } = useGetProfileQuery(
    data,
    { skip }
  );

  // User Polls.
  const [polls, setPolls] = useState(null);
  const { data: dataPolls, isLoading: isPollsLoading } = useGetUserPollsQuery(
    data,
    { skip }
  );

  // Query to update the profile data in the global state.
  const { data: dataSelfProfile } = useReadProfileQuery(data, {
    skip: selfProfileSkip,
  });

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        username: username,
      });
    } else {
      setData({
        username: username,
      });
    }
  }, [username, session.token]);

  // Conditional fetching.
  useEffect(() => {
    {
      data ? setSkip(false) : setSkip(true);
    }
  }, [data]);

  // Load Profile.
  useEffect(() => {
    {
      dataProfile && setProfile(dataProfile.profile);
    }
  }, [dataProfile]);

  // Load Polls.
  useEffect(() => {
    {
      dataPolls && setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  // Load Self Profile.
  useEffect(() => {
    if (dataSelfProfile && username === session.user.username) {
      dispatch(
        updateProfile({
          profile: dataSelfProfile.profile,
        })
      );
      setSelfProfileSkip(true);
    }
  }, [dataSelfProfile]);

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
                <ProfileModal
                  profile={profile}
                  setSelfProfileSkip={setSelfProfileSkip}
                />
              </Flex>

              <Stack spacing={4}>
                <Box>
                  <HStack spacing={2}>
                    {/* Profile name. */}
                    <Heading opacity={isDark ? 1 : 0.9} size="md">
                      {profile.profile_name}
                    </Heading>
                    {/* Pronouns. */}
                    <Text opacity={0.5} fontWeight="medium" fontSize="md">
                      {profile.pronouns}
                    </Text>
                  </HStack>
                  {/* Username. */}
                  <Text opacity={0.5} fontWeight="normal" fontSize="md">
                    @{profile.username}
                  </Text>
                </Box>
                <Stack spacing={2}>
                  {/* Biography. */}
                  {profile.bio && (
                    <Text opacity={0.9} fontWeight="medium" fontSize={"md"}>
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
                    {profile.social_link_one &&
                      profile.social_link_two &&
                      profile.social_link_three && (
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

      {/* Profile Body. */}
      <Tabs isFitted position="relative" variant="unstyled">
        <TabList {...styles.body.tab_list}>
          <Tab>Polls</Tab>
          <Tab>Votes</Tab>
        </TabList>
        <TabIndicator {...styles.body.tab_indicator} />
        <TabPanels>
          <TabPanel px={0}>
            <Box {...styles.body.content}>
              {isPollsLoading && <ProfileSpinner />}
              {polls ? (
                polls.map((poll, index) => <PollCard key={index} poll={poll} />)
              ) : (
                <div>user has not polls</div>
              )}
            </Box>
          </TabPanel>
          <TabPanel px={0}>
            <Box {...styles.body.content}>
              {isPollsLoading && <ProfileSpinner />}

              {polls &&
                polls.map((poll, index) => (
                  <PollCard key={index} poll={poll} />
                ))}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Profile;
