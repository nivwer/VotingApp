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
  Text,
} from "@chakra-ui/react";

// Page.
function Profile() {
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();
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

  return (
    <>
      {/* Profile Header. */}
      <Box {...styles.header.content}>
        {profile && (
          <>
            <Flex {...styles.header.container}>
              <Flex {...styles.header.flex}>
                <Box>
                  <Avatar
                    bg={"gray.400"}
                    size="2xl"
                    src={profile.profile_picture}
                  />
                </Box>
                <ProfileModal
                  profile={profile}
                  setSelfProfileSkip={setSelfProfileSkip}
                />
              </Flex>

              <Stack>
                <Box>
                  <HStack spacing={2}>
                    <Heading opacity={isDark ? 1 : 0.9} size="md">
                      {profile.profile_name}
                    </Heading>
                    <Text opacity={0.5} fontWeight="medium" fontSize="md" >{profile.pronouns}</Text>
                  </HStack>
                  <Text opacity={0.5} fontWeight="normal" fontSize="md">
                    @{profile.username}
                  </Text>
                </Box>
                <Text opacity={0.9} fontWeight="medium" >{profile.bio}</Text>
                <Link>{profile.website_link}</Link>
                <Link>{profile.social_link_one}</Link>
                <Link>{profile.social_link_two}</Link>
                <Link>{profile.social_link_three}</Link>
                <Text opacity={0.7}>Joined September 2022</Text>

                <Text>{profile.country}</Text>
                <Text>{profile.city}</Text>
                <Text>{profile.timezone}</Text>
              </Stack>
            </Flex>
          </>
        )}
      </Box>
      {/* Profile Body. */}
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
            <PollCard key={index} poll={poll} isOwner={dataPolls.is_owner} />
          ))}
      </Box>
    </>
  );
}

export default Profile;
