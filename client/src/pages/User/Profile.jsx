// Hooks.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useViewUserMutation } from "../../api/authApiSlice";
import { useUserPollsMutation } from "../../api/pollApiSlice";
import {
  useColorMode,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import PollCard from "../../components/Cards/PollCard";

// Page.
function Profile() {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const { username } = useParams();
  const session = useSelector((state) => state.session);
  // const [user, setUser] = useState(null);
  //const [viewUser, { data: dataUser, error }] = useViewUserMutation();
  const [polls, setPolls] = useState(null);
  const [userPolls, { data: dataPolls, error }] = useUserPollsMutation();

  useEffect(() => {
    if (session.token) {
      userPolls({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        username: username,
      });
    } else {
      userPolls({
        username: username,
      });
    }
  }, [username]);

  useEffect(() => {
    if (dataPolls) {
      setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  return (
    <>
      <Box
        p={"6"}
        overflow="hidden"
        w={"100%"}
        bg={isDark ? "black" : `${color}.bg-l-p`}
        color={isDark ? `${color}.text-d-p` : `${color}.900`}
      >
        <Flex spacing="2">
          <Flex flex="1" flexDir={"column"} alignItems="start" flexWrap="wrap">
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
        </Flex>
      </Box>
      {dataPolls && <PollCard dataPolls={dataPolls} />}
    </>
  );
}

export default Profile;
