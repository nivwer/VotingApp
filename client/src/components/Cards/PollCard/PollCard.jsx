// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDeletePollMutation } from "../../../api/pollApiSlice";
// Components.
import CardOptionButton from "./CardOptionButton";
import CardButton from "./CardButton";
import PollModal from "../../Modals/PollModal/PollModal";
import CustomProgress from "../../Progress/CustomProgress";
import {
  Avatar,
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

// Component.
function PollCard({ poll }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getPollCardStyles(ThemeColor, isDark);
  // User Session.
  const session = useSelector((state) => state.session);

  // Vote.
  const [vote, setVote] = useState(poll.user_vote);

  const [isDisabled, setIsDisabled] = useState(false);

  // Request to delete polls.
  const [deletePoll, { isLoading: isRemovingPoll, isError }] =
    useDeletePollMutation();

  // Conditional isLoading.
  const isLoading = isRemovingPoll;

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

  return (
    <>
      {poll && (
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
                <Avatar bg={"gray.400"} src={poll.profile.profile_picture} />
              </IconButton>
              <Stack spacing={0}>
                <Heading {...styles.header.heading}>
                  {poll.profile.profile_name}
                </Heading>
                <Text {...styles.header.text}>@{poll.profile.username}</Text>
              </Stack>
            </Flex>
            {session.token && (
              <Menu>
                <MenuButton
                  isDisabled={isLoading}
                  as={IconButton}
                  aria-label={"Options"}
                  icon={<FaEllipsis />}
                  {...styles.header.menu.button}
                />
                {poll.is_owner ? (
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
            )}
          </CardHeader>

          {/* Card Body. */}
          <CardBody>
            <Stack spacing={6}>
              <Stack>
                <Heading {...styles.body.heading}>{poll.title}</Heading>
                <Text {...styles.body.text}>{poll.description}</Text>
              </Stack>
              <Flex justifyContent={"center"}>
                <Stack w={"90%"}>
                  {poll.options.map((option, index) => (
                    <CardOptionButton
                      poll={poll}
                      vote={vote}
                      setVote={setVote}
                      value={option.option_text}
                      key={index}
                      isDisabled={isLoading || isDisabled}
                      setIsDisabled={setIsDisabled}
                    >
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
