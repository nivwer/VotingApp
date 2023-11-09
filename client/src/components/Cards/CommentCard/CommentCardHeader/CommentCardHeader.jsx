// Components.
import { Avatar, HStack, IconButton } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// SubComponent ( CommentCard ).
function CommentCardHeader({ comment, isLoading }) {
  return (
    <>
      {/* Profile Picture. */}
      <HStack flex={1} mt={3}>
        <NavLink to={`/${comment.user_profile.username}`}>
          <IconButton isDisabled={isLoading} variant={"unstyled"}>
            <Avatar
              src={comment.user_profile.profile_picture}
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

export default CommentCardHeader;
