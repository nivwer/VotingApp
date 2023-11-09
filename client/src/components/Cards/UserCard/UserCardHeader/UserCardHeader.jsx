// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Avatar, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// SubComponent ( UserCard ).
function UserCardHeader({ user }) {
  const isLoading = false;
  return (
    <>
      <HStack flex={1} mt={3}>
        {/* Profile Picture. */}
        <NavLink to={`/${user.username}`}>
          <IconButton isDisabled={isLoading} variant={"unstyled"}>
            <Avatar
              src={user.profile_picture}
              size={"md"}
              h={"42px"}
              w={"42px"}
              bg={"gray.400"}
            />
          </IconButton>
        </NavLink>
      </HStack>
    </>
  );
}

export default UserCardHeader;
