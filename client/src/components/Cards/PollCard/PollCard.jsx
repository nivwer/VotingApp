// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useEffect, useState } from "react";
import { useDeletePollMutation } from "../../../api/pollApiSlice";
// Components.
import PollCardOptionButton from "./PollCardOptionButton";
import PollCardButton from "./PollCardButton";
import PollCardMenu from "./PollCardMenu";
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
  HStack,
  Button,
  Icon,
  Box,
} from "@chakra-ui/react";
// Icons.
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
// Others.
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";
import { Link, NavLink, UNSAFE_NavigationContext } from "react-router-dom";
import PollCardInputOption from "./PollCardInputOption";

// Component.
function PollCard({ poll }) {
  const { isDark } = useThemeInfo();

  // Time Ago.
  const creationDate = new Date(poll.creation_date);
  const now = new Date();
  let timeAgo;
  if (isToday(creationDate)) {
    const minutesAgo = differenceInMinutes(now, creationDate);
    const hoursAgo = differenceInHours(now, creationDate);
    timeAgo = minutesAgo < 60 ? `${minutesAgo}m` : `${hoursAgo}h`;
  } else {
    timeAgo = format(creationDate, "MM/dd/yy");
  }

  // Request to delete polls.
  const [deletePoll, { isLoading }] = useDeletePollMutation();

  // Vote.
  const [vote, setVote] = useState(poll.user_vote);
  const [isDisabled, setIsDisabled] = useState(false);

  // Show all options.
  const [showAllOptions, setShowAllOptions] = useState(false);
  // Show input option.
  const [showInputOption, setShowInputOption] = useState(false);

  return (
    <>
      {poll && (
        <Card
          bg={isDark ? "black" : "white"}
          w="100%"
          borderRadius="0"
          borderBottom={"1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        >
          {isLoading && <CustomProgress />}

          {/* Card Header. */}
          <CardHeader as={Flex} spacing={"4"}>
            <Flex flex="1" gap="3">
              {/* Profile Picture. */}
              <Box h={"100%"}>
                <NavLink to={`/${poll.profile.username}`}>
                  <IconButton isDisabled={isLoading} variant={"unstyled"}>
                    <Avatar
                      src={poll.profile.profile_picture}
                      size={"md"}
                      bg={"gray.400"}
                    />
                  </IconButton>
                </NavLink>
              </Box>

              <Stack fontSize={"md"} spacing={0}>
                <HStack spacing={1}>
                  {/* Profile Name. */}
                  <NavLink to={`/${poll.profile.username}`}>
                    <Text fontWeight={"black"} opacity={isDark ? 1 : 0.9}>
                      {poll.profile.profile_name}
                    </Text>
                  </NavLink>
                  {/* Username. */}
                  <NavLink to={`/${poll.profile.username}`}>
                    <Text fontWeight={"normal"} opacity={0.5}>
                      @{poll.profile.username}
                    </Text>
                  </NavLink>
                </HStack>

                <HStack
                  spacing={1}
                  fontSize="sm"
                  fontWeight="semibold"
                  opacity={0.5}
                >
                  {/* Total Votes. */}
                  <Text>
                    {poll.total_votes}{" "}
                    {poll.total_votes === 1 ? "Vote" : "Votes"}
                  </Text>
                  {/* Divider. */}
                  <Text>·</Text>
                  {/* Time Ago. */}
                  <Text>{timeAgo}</Text>
                </HStack>
              </Stack>
            </Flex>

            {/* Menu. */}
            <PollCardMenu
              poll={poll}
              isLoading={isLoading}
              deletePoll={deletePoll}
            />
          </CardHeader>

          {/* Card Body. */}
          <CardBody>
            <Flex justifyContent={"center"}>
              <Stack spacing={6} w={"90%"}>
                <Stack textAlign={"center"}>
                  {/* Title. */}
                  <Heading size={"md"} opacity={0.9}>
                    {poll.title}
                  </Heading>
                  {/* Description. */}
                  <Text fontSize={"md"} opacity={0.8}>
                    {poll.description}
                  </Text>
                </Stack>

                {/* Poll options. */}
                <Stack px={4}>
                  {poll.options
                    .slice(0, poll.options.length)
                    .sort((a, b) => b.votes - a.votes)
                    .slice(0, showAllOptions ? poll.options.length : 4)
                    .map((option, index) => (
                      <PollCardOptionButton
                        key={index}
                        poll={poll}
                        option={option}
                        vote={vote}
                        setVote={setVote}
                        value={option.option_text}
                        isDisabled={isLoading || isDisabled}
                        setIsDisabled={setIsDisabled}
                      >
                        {option.option_text}
                      </PollCardOptionButton>
                    ))}
                  {showInputOption && (
                    <PollCardInputOption
                      poll_id={poll._id}
                      setShowInputOption={setShowInputOption}
                    />
                  )}
                </Stack>
                {/* Show all options button. */}
                {poll.options && poll.options.length > 4 && (
                  <Flex opacity={0.8} justify={"center"}>
                    <Button
                      onClick={() => setShowAllOptions(!showAllOptions)}
                      size={"sm"}
                      variant={"ghost"}
                      borderRadius={"full"}
                      pl={6}
                      rightIcon={
                        <Icon
                          boxSize={6}
                          as={showAllOptions ? ChevronUpIcon : ChevronDownIcon}
                        />
                      }
                    >
                      {showAllOptions ? "Show less" : "Show more"}
                    </Button>
                  </Flex>
                )}
              </Stack>
            </Flex>
          </CardBody>

          {/* Card Footer. */}
          <CardFooter justify={"space-between"} flexWrap={"wrap"}>
            <PollCardButton isLoading={isLoading}>Share</PollCardButton>
            <PollCardButton isLoading={isLoading}>Comment</PollCardButton>
            <PollCardButton isLoading={isLoading}>
              <Link to={`/${poll.profile.username}/${poll._id}`}>Views</Link>
            </PollCardButton>
            <PollCardButton
              isLoading={isLoading}
              onClick={() => setShowInputOption(!showInputOption)}
            >
              Add option
            </PollCardButton>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PollCard;
