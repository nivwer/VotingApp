// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useDeleteCommentMutation } from "../../../api/pollApiSlice";
// Components.
import { Card, CardBody, CardFooter, CardHeader, Flex } from "@chakra-ui/react";
// SubComponents.
import CommentCardHeader from "./CommentCardHeader/CommentCardHeader";
import CommentCardBody from "./CommentCardBody/CommentCardBody";
import CommentCardFooter from "./CommentCardFooter/CommentCardFooter";

// Component.
function CommentCard({ comment }) {
  const { isDark } = useThemeInfo();

  // Request to delete the comment.
  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

  return (
    <>
      <Card
        bg={isDark ? "black" : "white"}
        w="100%"
        borderRadius="0"
        direction={"row"}
        borderBottom={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        opacity={isLoading ? 0.6 : 1}
      >
        {/* Card Header. */}
        <CardHeader as={Flex} spacing={"4"} pt={0} pr={2}>
          <CommentCardHeader comment={comment} isLoading={isLoading} />
        </CardHeader>

        {/* Card Body. */}
        <CardBody py={5} px={0}>
          <CommentCardBody comment={comment} isLoading={isLoading} />
        </CardBody>

        {/* Card Footer. */}
        <CardFooter py={3}>
          <CommentCardFooter
            comment={comment}
            isLoading={isLoading}
            deleteComment={deleteComment}
          />
        </CardFooter>
      </Card>
    </>
  );
}

export default CommentCard;
