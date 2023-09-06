// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useEffect, useState } from "react";
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

// Component.
function PollCard({ poll }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getPollCardStyles(ThemeColor, isDark);
  // User Session.
  const session = useSelector((state) => state.session);
  // Request to delete polls.
  const [deletePoll, { isLoading, isError }] = useDeletePollMutation();


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
      <Card {...styles.card}>
        {/* Card Header. */}
        <CardHeader as={Flex} spacing={"4"}>
          <Flex {...styles.header.flex}>
            <Avatar name={poll.created_by.username} />
            <Box>
              <Heading {...styles.header.heading}>
                {poll.created_by.first_name}
              </Heading>
              <Text {...styles.header.text}>@{poll.created_by.username}</Text>
            </Box>
          </Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label={"Options"}
              icon={<FaEllipsis />}
              {...styles.header.menu.button}
            />
            <MenuList {...styles.header.menu.list}>
              <MenuItem
                as={PollModal}
                buttonStyles={styles.header.menu.item}
                poll={poll}
              >
                Edit
              </MenuItem>
              <MenuItem
                as={Button}
                {...styles.header.menu.item}
                onClick={() => handleDeletePoll(poll._id)}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>

        {/* Card Body. */}
        <CardBody>
          <Stack spacing={3}>
            <Heading {...styles.body.heading}>{poll.title}</Heading>
            <Text {...styles.body.text}>{poll.description}</Text>
            <Stack w={"100%"}>
              {poll.options.map((option, index) => (
                <CardOptionButton key={index}>{option.option_text}</CardOptionButton>
              ))}
            </Stack>
          </Stack>
        </CardBody>

        {/* Card Footer. */}
        <CardFooter {...styles.footer}>
          <CardButton>Button1</CardButton>
          <CardButton>Button2</CardButton>
          <CardButton>Button3</CardButton>
        </CardFooter>
      </Card>
    </>
  );
}

export default PollCard;
