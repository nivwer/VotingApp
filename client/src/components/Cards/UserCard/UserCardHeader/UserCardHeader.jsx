import { Avatar, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function UserCardHeader({ user }) {
  return (
    <HStack flex={1} mt={3}>
      <NavLink to={`/${user.username}`}>
        <IconButton variant={"unstyled"}>
          <Avatar
            bg={user.profile_picture ? "transparent" : "gray.400"}
            size={"md"}
            h={"42px"}
            w={"42px"}
            src={user.profile_picture}
          />
        </IconButton>
      </NavLink>
    </HStack>
  );
}

export default UserCardHeader;
