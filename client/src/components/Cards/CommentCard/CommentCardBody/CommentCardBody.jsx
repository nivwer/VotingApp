// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import { Flex, HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Others.
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";
import CommentCardMenu from "./CommentCardMenu/CommentCardMenu";

// SubComponent ( CommentCard ).
function CommentCardBody({ comment, isLoading, deleteComment }) {
  const { isDark } = useThemeInfo();

  // Time Ago.
  const creationDate = new Date(comment.created_at);
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
      <HStack justify={"space-between"}>
        <HStack fontSize={"md"} spacing={1}>
          {/* Profile Name. */}
          <NavLink to={`/${comment.user_profile.username}`}>
            <Text h={5} fontWeight={"extrabold"} opacity={isDark ? 1 : 0.8}>
              {comment.user_profile.profile_name}
            </Text>
          </NavLink>
          {/* Username. */}
          <NavLink to={`/${comment.user_profile.username}`}>
            <Text h={5} fontWeight={"medium"} opacity={0.5}>
              @{comment.user_profile.username}
            </Text>
          </NavLink>
          <HStack spacing={1} fontWeight="medium" opacity={0.5}>
            {/* Divider. */}
            <Text h={5}>·</Text>
            {/* Time Ago. */}
            <Text h={5}>{timeAgo}</Text>
          </HStack>
        </HStack>

        <CommentCardMenu
          comment={comment}
          deleteComment={deleteComment}
          isLoading={isLoading}
        />
      </HStack>
      <Flex px={0} mt={1} fontSize={"md"}>
        <Text
          opacity={0.8}
          w={"auto"}
          fontWeight={"medium"}
          wordBreak={"break-word"}
        >
          {comment.comment}
        </Text>
      </Flex>
    </>
  );
}

export default CommentCardBody;
