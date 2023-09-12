// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { useDeletePollMutation } from "../../../api/pollApiSlice";
// Components.
import CardOptionButton from "./CardOptionButton";
import CardButton from "./CardButton";
import PollModal from "../../Modals/PollModal/PollModal";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
// Icons.
import { FaEllipsis } from "react-icons/fa6";
// Styles.
import { getPollCardStyles } from "./PollCardStyles";
import CustomProgress from "../../Progress/CustomProgress";
import { useEffect, useState } from "react";
import { useGetProfileQuery } from "../../../api/profileApiSlice";

// Component.
function PollCard({ poll, isOwner }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getPollCardStyles(ThemeColor, isDark);
  // User Session.
  const session = useSelector((state) => state.session);

  // Querys or mutations.
  const [data, setData] = useState(false);
  const [skip, setSkip] = useState(true);

  // Get user data.
  const [profile, setProfile] = useState(null);
  const { data: dataProfile, isLoading: isLoadingProfile } = useGetProfileQuery(
    data,
    { skip }
  );

  // Request to delete polls.
  const [deletePoll, { isLoading: isRemovingPoll, isError }] =
    useDeletePollMutation();

  const isLoading = isRemovingPoll || isLoadingProfile;

  // Delete poll.
  const handleDeletePoll = async (poll_id) => {
    try {
      const res = await deletePoll({
        id: poll_id,
        token: session.token,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Update data to fetchs.
  useEffect(() => {
    if (session.token) {
      setData({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        username: poll.created_by.username,
      });
    } else {
      setData({
        username: poll.created_by.username,
      });
    }
  }, [session.token]);

  // Conditional fetching.
  useEffect(() => {
    if (data) {
      setSkip(false);
    } else {
      setSkip(true);
    }
  }, [data]);

  // Load Profile.
  useEffect(() => {
    if (dataProfile) {
      setProfile(dataProfile.profile);
    }
  }, [dataProfile]);

  return (
    <>
      {profile && (
        <Card {...styles.card}>
          {isLoading && <CustomProgress />}
          {/* Card Header. */}
          <CardHeader as={Flex} spacing={"4"}>
            <Flex {...styles.header.flex}>
              <IconButton
                h={"100%"}
                isDisabled={isLoading}
                variant={"unstyled"}
              >
                <Avatar bg={"gray.400"} src={profile.profile_picture} />
              </IconButton>
              <Stack spacing={0}>
                <Heading {...styles.header.heading}>
                  {profile.profile_name}
                </Heading>
                <Text {...styles.header.text}>@{poll.created_by.username}</Text>
              </Stack>
            </Flex>
            <Menu>
              <MenuButton
                isDisabled={isLoading}
                as={IconButton}
                aria-label={"Options"}
                icon={<FaEllipsis />}
                {...styles.header.menu.button}
              />
              {isOwner ? (
                <MenuList {...styles.header.menu.list}>
                  <MenuItem
                    isDisabled={isLoading}
                    as={PollModal}
                    buttonStyles={styles.header.menu.item}
                    poll={poll}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    isDisabled={isLoading}
                    as={Button}
                    {...styles.header.menu.item}
                    onClick={() => handleDeletePoll(poll._id)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              ) : (
                <MenuList>
                  <MenuItem>Hola</MenuItem>
                </MenuList>
              )}
            </Menu>
          </CardHeader>

          {/* Card Body. */}
          <CardBody>
            <Stack spacing={3}>
              <Heading {...styles.body.heading}>{poll.title}</Heading>
              <Text {...styles.body.text}>{poll.description}</Text>
              <Flex justifyContent={"center"}>
                <Stack w={"90%"}>
                  {poll.options.map((option, index) => (
                    <CardOptionButton key={index} isLoading={isLoading}>
                      {option.option_text}
                    </CardOptionButton>
                  ))}
                </Stack>
              </Flex>
            </Stack>
          </CardBody>

          {/* Card Footer. */}
          <CardFooter {...styles.footer}>
            <CardButton isLoading={isLoading}>Share</CardButton>
            <CardButton isLoading={isLoading}>Comment</CardButton>
            <CardButton isLoading={isLoading}>Views</CardButton>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PollCard;
