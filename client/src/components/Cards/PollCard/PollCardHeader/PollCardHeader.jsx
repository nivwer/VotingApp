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
        <HStack flex={1} mt={4}>
          {/* user_Profile Picture. */}
          <NavLink to={`/${poll.user_profile.username}`}>
            <IconButton isDisabled={isLoading} variant={"unstyled"}>
              <Avatar
                src={poll.user_profile.profile_picture}
                size={"md"}
                h={"42px"}
                w={"42px"}
                bg={"gray.400"}
              />
            </IconButton>
          </NavLink>

          <Stack w={"100%"} mt={1} ml={1} fontSize={"md"} spacing={0}>
            <HStack justify={"space-between"}>
              <HStack spacing={1}>
                {/* user_Profile Name. */}
                <NavLink to={`/${poll.user_profile.username}`}>
                  <Text h={5} fontWeight={"black"} opacity={isDark ? 1 : 0.8}>
                    {poll.user_profile.profile_name}
                  </Text>
                </NavLink>
                {/* Username. */}
                <NavLink to={`/${poll.user_profile.username}`}>
                  <Text h={5} fontWeight={"medium"} opacity={0.5}>
                    @{poll.user_profile.username}
                  </Text>
                </NavLink>
                <HStack spacing={1} fontWeight="medium" opacity={0.5}>
                  {/* Divider. */}
                  <Text h={5}>·</Text>
                  {/* Time Ago. */}
                  <Text h={5}>{timeAgo}</Text>
                </HStack>
              </HStack>
              {/* Menu. */}
              <PollCardMenu
                poll={poll}
                isLoading={isLoading}
                deletePoll={deletePoll}
              />
            </HStack>

            {/* Total Votes. */}
            <Text fontWeight="medium" opacity={0.5}>
              {poll.votes_counter} {poll.votes_counter === 1 ? "Vote" : "Votes"}
            </Text>
          </Stack>
        </HStack>
      </HStack>
    </>
  );
}

export default PollCardHeader;
