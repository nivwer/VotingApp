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
import ProfileModal from "../../components/Modals/ProfileModal/ProfileModal";
import PollCard from "../../components/Cards/PollCard/PollCard";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Link,
  Spinner,
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
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getProfileStyles(isDark);
  // Session.
  const session = useSelector((state) => state.session);
  // Username param.
  const { username } = useParams();

  // Querys or mutations.
  const [data, setData] = useState(false);
  const [skip, setSkip] = useState(true);
  const [selfProfileSkip, setSelfProfileSkip] = useState(true);

  // Query to update the profile data in the global state.
  const { data: dataSelfProfile } = useReadProfileQuery(data, {
    skip: selfProfileSkip,
  });

  // User Profile.
  const [profile, setProfile] = useState(null);
  const { data: dataProfile, isLoading: isLoadingProfile } = useGetProfileQuery(
    data,
    { skip }
  );

  // User Polls.
  const [polls, setPolls] = useState(null);
  const { data: dataPolls, isLoading: isGettingPolls } = useGetUserPollsQuery(
    data,
    { skip }
  );

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
    if (data) {
      setSkip(false);
    } else {
      setSkip(true);
    }
  }, [data]);

  // Load Self Profile.
  useEffect(() => {
    if (dataSelfProfile) {
      dispatch(
        updateProfile({
          profile: dataSelfProfile.profile,
        })
      );
      setSelfProfileSkip(true);
    }
  }, [dataSelfProfile]);

  // Load Profile.
  useEffect(() => {
    if (dataProfile) {
      setProfile(dataProfile.profile);
    }
  }, [dataProfile]);

  // Load Polls.
  useEffect(() => {
    if (dataPolls) {
      setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  const socialLinksList = profile && [
    profile.social_link_one,
    profile.social_link_two,
    profile.social_link_three,
  ];
  const isSocialLink =
    profile &&
    profile.social_link_one &&
    profile.social_link_two &&
    profile.social_link_three
      ? true
      : false;

  return (
    <>
      {/* Profile Header. */}
      <Box {...styles.header.content}>
        {profile && (
          <>
            <Flex {...styles.header.container}>
              <Flex {...styles.header.flex}>
                {/* Avatar. */}
                <Box>
                  <Avatar
                    bg={"gray.400"}
                    size="2xl"
                    src={profile.profile_picture}
                  />
                </Box>
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
                    <Box>
                      <Text opacity={0.9} fontWeight="medium" fontSize={"md"}>
                        {profile.bio}
                      </Text>
                    </Box>
                  )}

                  {/* Links. */}
                  {isSocialLink && profile.website_link && (
                    <Stack spacing={0}>
                      {/* Website Link. */}
                      {profile.website_link && (
                        <HStack
                          opacity={0.6}
                          spacing={1}
                          fontWeight={"semibold"}
                          fontSize={"md"}
                        >
                          <FaLink />
                          <Link
                            color={
                              isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`
                            }
                          >
                            {
                              profile.website_link
                                .replace(/(https:\/\/)|(www\.)/g, "")
                                .split("/")[0]
                            }
                          </Link>
                        </HStack>
                      )}
                      {/* Social Links. */}
                      {isSocialLink && (
                        <HStack
                          color={
                            isDark ? `${ThemeColor}.100` : `${ThemeColor}.600`
                          }
                          opacity={0.6}
                          spacing={2}
                          fontSize={"md"}
                        >
                          {socialLinksList &&
                            socialLinksList.map((socialLink, index) => (
                              <Link key={index}>
                                {
                                  socialLink
                                    .replace(/(https:\/\/)|(www\.)/g, "")
                                    .split("/")[0]
                                }
                              </Link>
                            ))}
                        </HStack>
                      )}
                    </Stack>
                  )}

                  {/* Tags. */}
                  <HStack spacing={5}>
                    {/* Joined date. */}
                    <HStack spacing={1} fontSize={"md"} opacity={0.6}>
                      <FaRegCalendar />
                      <Text
                        fontWeight={"medium"}
                        display={"flex"}
                        h={"100%"}
                        mt={"4px"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        Joined September 2022
                      </Text>
                    </HStack>
                    {/* Location. */}
                    {profile.country && (
                      <HStack spacing={1} fontSize={"md"} opacity={0.6}>
                        <FaLocationDot />
                        <Text
                          fontWeight={"medium"}
                          display={"flex"}
                          h={"100%"}
                          mt={"4px"}
                          justifyContent={"center"}
                          alignItems={"center"}
                        >
                          {profile.country}
                          {profile.city && ` (${profile.city})`}
                        </Text>
                      </HStack>
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
        <TabList
          borderBottom={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
          color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        >
          <Tab opacity={isDark ? 0.9 : 0.6} fontWeight={"bold"}>
            Polls
          </Tab>
          <Tab opacity={isDark ? 0.9 : 0.6} fontWeight={"bold"}>
            Votes
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="3px"
          bg={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
          borderRadius="3px"
          opacity={0.7}
        />
        <TabPanels>
          <TabPanel px={0}>
            <Box {...styles.body.content}>
              {isGettingPolls && (
                <Flex
                  h={"100px"}
                  w={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Spinner size="md" />
                </Flex>
              )}

              {polls &&
                polls.map((poll, index) => (
                  <PollCard
                    key={index}
                    poll={poll}
                  />
                ))}
            </Box>
          </TabPanel>
          <TabPanel px={0}>
            <Box {...styles.body.content}>
              {isGettingPolls && (
                <Flex
                  h={"100px"}
                  w={"100%"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Spinner size="md" />
                </Flex>
              )}

              {polls &&
                polls.map((poll, index) => (
                  <PollCard
                    key={index}
                    poll={poll}
                  />
                ))}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Profile;
