// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { NavLink } from "react-router-dom";
import { Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";

// SubComponent ( UserCard ).
function UserCardBody({ user }) {
  const { isDark } = useThemeInfo();
  return (
    <>
      <HStack justify={"space-between"}>
        <Stack fontSize={"md"} spacing={0}>
          {/* Profile Name. */}
          <NavLink to={`/${user.username}`}>
            <Text h={5} fontWeight={"extrabold"} opacity={isDark ? 1 : 0.9}>
              {user.profile_name}
            </Text>
          </NavLink>
          {/* Username. */}
          <NavLink to={`/${user.username}`}>
            <Text h={5} fontWeight={"medium"} opacity={0.5}>
              @{user.username}
            </Text>
          </NavLink>
        </Stack>
        <NavLink to={`/${user.username}`}>
          <Button h={9} w={24} borderRadius={"full"}>
            Profile
          </Button>
        </NavLink>
      </HStack>
      {user.bio && (
        <Flex px={0} mt={2} fontSize={"md"}>
          <Text
            opacity={0.8}
            w={"auto"}
            fontWeight={"medium"}
            wordBreak={"break-word"}
          >
            {user.bio}
          </Text>
        </Flex>
      )}
    </>
  );
}

export default UserCardBody;
