// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useState } from "react";
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
// Styles.
import { getPollCardStyles } from "./PollCardStyles";
// Others.
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";

// Component.
function PollCard({ poll }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getPollCardStyles(ThemeColor, isDark);

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

  return (
    <>
      {poll && (
        <Card {...styles.card}>
          {isLoading && <CustomProgress />}
          <HStack>
            <div> {poll.voters}</div>
          </HStack>
          {/* Card Header. */}
          <CardHeader as={Flex} spacing={"4"}>
            <Flex {...styles.header.flex}>
              {/* Profile Picture. */}
              <Box h={"100%"}>
                <IconButton isDisabled={isLoading} variant={"unstyled"}>
                  <Avatar
                    size={"md"}
                    src={poll.profile.profile_picture}
                    bg={"gray.400"}
                  />
                </IconButton>
              </Box>
              <Stack fontSize={"md"} spacing={0}>
                <HStack spacing={1}>
                  {/* Profile Name. */}
                  <Text fontWeight={"black"} opacity={isDark ? 1 : 0.9}>
                    {poll.profile.profile_name}
                  </Text>
                  {/* Username. */}
                  <Text fontWeight={"medium"} opacity={0.5}>
                    @{poll.profile.username}
                  </Text>
                </HStack>

                <HStack
                  fontSize={"sm"}
                  spacing={1}
                  fontWeight={"semibold"}
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
                <Stack>
                  <Heading {...styles.body.title}>{poll.title}</Heading>
                  <Text {...styles.body.description}>{poll.description}</Text>
                </Stack>
                <Stack px={4}>
                  {poll.options
                    .slice(0, showAllOptions ? poll.options.length : 4)
                    .sort((a, b) => b.votes - a.votes)
                    .map((option, index) => (
                      <PollCardOptionButton
                        poll={poll}
                        vote={vote}
                        setVote={setVote}
                        value={option.option_text}
                        key={index}
                        isDisabled={isLoading || isDisabled}
                        setIsDisabled={setIsDisabled}
                      >
                        {option.option_text}( votes: {option.votes} ) ( user
                        vote: "{poll.user_vote}" )
                      </PollCardOptionButton>
                    ))}
                </Stack>
                {poll.options && poll.options.length > 4 && (
                  <Flex opacity={0.8} justify={"center"}>
                    <Button
                      pl={6}
                      rightIcon={
                        <Icon
                          boxSize={6}
                          as={showAllOptions ? ChevronUpIcon : ChevronDownIcon}
                        />
                      }
                      variant={"ghost"}
                      borderRadius={"full"}
                      onClick={() => setShowAllOptions(!showAllOptions)}
                    >
                      {showAllOptions ? "Show less" : "Show more"}
                    </Button>
                  </Flex>
                )}
              </Stack>
            </Flex>
          </CardBody>

          {/* Card Footer. */}
          <CardFooter {...styles.footer}>
            <PollCardButton isLoading={isLoading}>Share</PollCardButton>
            <PollCardButton isLoading={isLoading}>Comment</PollCardButton>
            <PollCardButton isLoading={isLoading}>Views</PollCardButton>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default PollCard;
