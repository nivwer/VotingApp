// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Avatar, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// SubComponent ( UserCard ).
function UserCardHeader({ user }) {
  const { isDark } = useThemeInfo();

  const isLoading = false;
  return (
    <HStack w={"100%"}>
      <HStack flex={1} mt={3}>
        {/* Profile Picture. */}
        <NavLink to={`/${user.username}`}>
          <IconButton isDisabled={isLoading} variant={"unstyled"}>
            <Avatar
              src={user.profile_picture}
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
            <NavLink to={`/${user.username}`}>
              <Text fontWeight={"black"} opacity={isDark ? 1 : 0.9}>
                {user.profile_name}
              </Text>
            </NavLink>
            {/* Username. */}
            <NavLink to={`/${user.username}`}>
              <Text fontWeight={"medium"} opacity={0.5}>
                @{user.username}
              </Text>
            </NavLink>
          </HStack>
        </Stack>
      </HStack>
      {/* <HStack justify={"space-between"}> */}
      {/* Menu. */}
      {/* <PollCardMenu
            poll={poll}
            isLoading={isLoading}
            deletePoll={deletePoll}
          /> */}
      {/* </HStack> */}
    </HStack>
  );
}

export default UserCardHeader;
