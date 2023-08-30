// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetUserPollsQuery } from "../../api/pollApiSlice";
// Components.
import PollCard from "../../components/Cards/PollCard/PollCard";
import { Avatar, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
// Styles.
import { getProfileStyles } from "./ProfileStyles";

// Page.
function Profile() {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getProfileStyles(ThemeColor, isDark);

  const { username } = useParams();
  const session = useSelector((state) => state.session);
  // const [user, setUser] = useState(null);
  //const [viewUser, { data: dataUser, error }] = useViewUserMutation();

  
  // User Polls.
  const [polls, setPolls] = useState(null);
  const [data, setData] = useState(false);
  const { data: dataPolls, error } = useGetUserPollsQuery(data);

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

  useEffect(() => {
    if (dataPolls) {
      setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  return (
    <>
      {/* Profile Header. */}
      <Box {...styles.header.content}>
        <Flex {...styles.header.flex}>
          <Box p={5} px={3}>
            <Avatar size="2xl" name="Segun Adebayo" />
          </Box>

          <Stack>
            <Box>
              <Heading size="md">Segun Adebayo</Heading>
              <Text opacity={0.5} fontWeight="hairline" fontSize="md">
                @adebayo
              </Text>
            </Box>
            <Text opacity={0.9}>This is my descr</Text>
            <Text opacity={0.7}>Joined September 2022</Text>
          </Stack>
        </Flex>
      </Box>
      {/* Profile Body. */}
      <Box {...styles.body.content}>
        {polls ? (
          polls.map((poll, index) => <PollCard key={index} poll={poll} />)
        ) : (
          <p>No polls available.</p>
        )}
      </Box>
    </>
  );
}

export default Profile;
