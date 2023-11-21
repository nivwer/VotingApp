// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useDeleteCommentMutation } from "../../../api/pollApiSlice";
// Components.
import { Card, CardBody, CardFooter, CardHeader, Flex } from "@chakra-ui/react";
// SubComponents.
import CommentCardHeader from "./CommentCardHeader/CommentCardHeader";
import CommentCardBody from "./CommentCardBody/CommentCardBody";

// Component.
function CommentCard({ item }) {
  const { comment } = item;
  const { isDark } = useThemeInfo();

  // Request to delete the comment.
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  return (
    <Card
      bg={isDark ? "black" : "white"}
      w="100%"
      borderRadius="0"
      direction={"row"}
      borderBottom={"1px solid"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.300"}
      opacity={isLoading ? 0.6 : 1}
      px={2}
    >
      {/* Card Header. */}
      <CardHeader spacing={"4"} pt={2} px={3}>
        <CommentCardHeader comment={comment} isLoading={isLoading} />
      </CardHeader>

      {/* Card Body. */}
      <CardBody py={5} px={0} pr={5}>
        <CommentCardBody
          comment={comment}
          isLoading={isLoading}
          deleteComment={deleteComment}
        />
      </CardBody>
    </Card>
  );
}

export default CommentCard;
