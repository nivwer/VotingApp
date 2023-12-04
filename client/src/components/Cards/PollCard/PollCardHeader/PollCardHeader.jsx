import { NavLink } from "react-router-dom";
import { Avatar, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import PollCardMenu from "./PollCardMenu/PollCardMenu";
import { getTimeAgo } from "../../../../utils/time/time";

function PollCardHeader({ poll, deletePoll, isLoading }) {
  const timeAgo = getTimeAgo(new Date(poll.created_at));

  return (
    <HStack w={"100%"}>
      <HStack flex={1} mt={4}>
        <NavLink to={`/${poll.user_profile.username}`}>
          <IconButton isDisabled={isLoading} variant={"unstyled"}>
            <Avatar
              bg={poll.user_profile.profile_picture ? "transparent" : "gray.400"}
              src={poll.user_profile.profile_picture}
              size={"md"}
              h={"42px"}
              w={"42px"}
            />
          </IconButton>
        </NavLink>

        <Stack w={"100%"} mt={1} ml={1} fontSize={"md"} spacing={0}>
          <HStack justify={"space-between"}>
            <HStack spacing={1}>
              <NavLink to={`/${poll.user_profile.username}`}>
                <Text h={5} fontWeight="black" opacity={0.9}>
                  {poll.user_profile.profile_name}
                </Text>
              </NavLink>
              <NavLink to={`/${poll.user_profile.username}`}>
                <Text h={5} fontWeight="medium" opacity={0.5}>
                  {`@${poll.user_profile.username}`}
                </Text>
              </NavLink>
              <HStack spacing={1} fontWeight="medium" opacity={0.5}>
                <Text children={"·"} h={5} />
                <Text children={timeAgo} h={5} />
              </HStack>
            </HStack>
            <PollCardMenu poll={poll} isLoading={isLoading} deletePoll={deletePoll} />
          </HStack>

          <Text fontWeight="medium" opacity={0.5}>
            {poll.votes_counter} {poll.votes_counter === 1 ? "Vote" : "Votes"}
          </Text>
        </Stack>
      </HStack>
    </HStack>
  );
}

export default PollCardHeader;
