import { useThemeInfo } from "../../../../hooks/Theme";
import { Flex, HStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import CommentCardMenu from "./CommentCardMenu/CommentCardMenu";
import { getTimeAgo } from "../../../../utils/time/time";

function CommentCardBody({ comment, isLoading, deleteComment }) {
  const { isDark } = useThemeInfo();
  const timeAgo = getTimeAgo(new Date(comment.created_at));

  return (
    <>
      <HStack justify={"space-between"}>
        <HStack fontSize={"md"} spacing={1}>
          <NavLink to={`/${comment.user_profile.username}`}>
            <Text h={5} fontWeight={"extrabold"} opacity={isDark ? 1 : 0.8}>
              {comment.user_profile.name}
            </Text>
          </NavLink>
          <NavLink to={`/${comment.user_profile.username}`}>
            <Text h={5} fontWeight={"medium"} opacity={0.5}>
              @{comment.user_profile.username}
            </Text>
          </NavLink>
          <HStack spacing={1} fontWeight="medium" opacity={0.5}>
            <Text children={"·"} h={5} />
            <Text children={timeAgo} h={5} />
          </HStack>
        </HStack>
        <CommentCardMenu comment={comment} deleteComment={deleteComment} isLoading={isLoading} />
      </HStack>
      <Flex px={0} mt={1} fontSize={"md"}>
        <Text opacity={0.8} w={"auto"} fontWeight={"medium"} wordBreak={"break-word"}>
          {comment.comment}
        </Text>
      </Flex>
    </>
  );
}

export default CommentCardBody;
