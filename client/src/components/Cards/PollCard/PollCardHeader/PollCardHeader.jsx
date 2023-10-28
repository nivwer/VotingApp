// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { NavLink } from "react-router-dom";
import { Avatar, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
// SubComponents.
import PollCardMenu from "./PollCardMenu/PollCardMenu";
// Others.
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";

// SubComponent ( PollCard ).
function PollCardHeader({ poll, deletePoll, isLoading }) {
  const { isDark } = useThemeInfo();

  // Time Ago.
  const creationDate = new Date(poll.created_at);
  const now = new Date();
  let timeAgo;
  if (isToday(creationDate)) {
    const minutesAgo = differenceInMinutes(now, creationDate);
    const hoursAgo = differenceInHours(now, creationDate);
    timeAgo = minutesAgo < 60 ? `${minutesAgo}m` : `${hoursAgo}h`;
  } else {
    timeAgo = format(creationDate, "MM/dd/yy");
  }

  return (
    <>
      <HStack w={"100%"}>
        <HStack flex={1} mt={3}>
          {/* Profile Picture. */}
          <NavLink to={`/${poll.profile.username}`}>
            <IconButton isDisabled={isLoading} variant={"unstyled"}>
              <Avatar
                src={poll.profile.profile_picture}
                size={"md"}
                h={"45px"}
                w={"45px"}
                bg={"gray.400"}
              />
            </IconButton>
          </NavLink>

          <Stack mt={2} fontSize={"md"} spacing={0}>
            <HStack spacing={1}>
              {/* Profile Name. */}
              <NavLink to={`/${poll.profile.username}`}>
                <Text fontWeight={"black"} opacity={isDark ? 1 : 0.9}>
                  {poll.profile.profile_name}
                </Text>
              </NavLink>
              {/* Username. */}
              <NavLink to={`/${poll.profile.username}`}>
                <Text fontWeight={"medium"} opacity={0.5}>
                  @{poll.profile.username}
                </Text>
              </NavLink>
              <HStack spacing={1} fontWeight="medium" opacity={0.5}>
                {/* Divider. */}
                <Text>·</Text>
                {/* Time Ago. */}
                <Text>{timeAgo}</Text>
              </HStack>
            </HStack>

            {/* Total Votes. */}
            <Text fontWeight="medium" opacity={0.5}>
              {poll.votes_counter} {poll.votes_counter === 1 ? "Vote" : "Votes"}
            </Text>
          </Stack>
        </HStack>
        <HStack justify={"space-between"}>
          {/* Menu. */}
          <PollCardMenu
            poll={poll}
            isLoading={isLoading}
            deletePoll={deletePoll}
          />
        </HStack>
      </HStack>
    </>
  );
}

export default PollCardHeader;
