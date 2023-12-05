import { Avatar, HStack, IconButton } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function CommentCardHeader({ comment, isLoading }) {
  return (
    <HStack flex={1} mt={3}>
      <NavLink to={`/${comment.user_profile.username}`}>
        <IconButton isDisabled={isLoading} variant={"unstyled"}>
          <Avatar
            bg={comment.user_profile.profile_picture ? "transparent" : "gray.400"}
            src={comment.user_profile.profile_picture}
            size={"md"}
            h={"42px"}
            w={"42px"}
          />
        </IconButton>
      </NavLink>
    </HStack>
  );
}

export default CommentCardHeader;
