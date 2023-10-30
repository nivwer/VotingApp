// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useDeleteCommentMutation } from "../../../api/pollApiSlice";
// Components.
import CommentCardMenu from "./CommentCardMenu";
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// Others.
import {
  format,
  isToday,
  differenceInMinutes,
  differenceInHours,
} from "date-fns";
import CustomProgress from "../../Progress/CustomProgress";

// Component.
function CommentCard({ comment }) {
  const { isDark } = useThemeInfo();

  const [deleteComment, { isLoading }] = useDeleteCommentMutation();

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
          {/* Profile Picture. */}
          <HStack flex={1} mt={3}>
            <NavLink to={`/${comment.user_profile.username}`}>
              <IconButton isDisabled={isLoading} variant={"unstyled"}>
                <Avatar
                  src={comment.user_profile.profile_picture}
                  size={"md"}
                  h={"45px"}
                  w={"45px"}
                  bg={"gray.400"}
                />
              </IconButton>
            </NavLink>
          </HStack>
        </CardHeader>

        {/* Card Body. */}
        <CardBody py={5} px={0}>
          <HStack fontSize={"md"} spacing={1}>
            {/* Profile Name. */}
            <NavLink to={`/${comment.user_profile.username}`}>
              <Text fontWeight={"extrabold"} opacity={isDark ? 1 : 0.9}>
                {comment.user_profile.profile_name}
              </Text>
            </NavLink>
            {/* Username. */}
            <NavLink to={`/${comment.user_profile.username}`}>
              <Text fontWeight={"medium"} opacity={0.5}>
                @{comment.user_profile.username}
              </Text>
            </NavLink>
            <HStack spacing={1} fontWeight="medium" opacity={0.5}>
              {/* Divider. */}
              <Text>·</Text>
              {/* Time Ago. */}
              <Text>{timeAgo}</Text>
            </HStack>
          </HStack>
          <Flex px={0} fontSize={"md"}>
            <Text
              opacity={0.8}
              w={"auto"}
              fontWeight={"medium"}
              
              wordBreak={"break-word"}
            >
              {comment.comment}
            </Text>
          </Flex>
        </CardBody>
        <CardFooter py={3}>
          <CommentCardMenu
            id={comment._id}
            user_id={comment.user_id}
            poll_id={comment.poll_id}
            deleteComment={deleteComment}
            isLoading={isLoading}
          />
        </CardFooter>
      </Card>
    </>
  );
}

export default CommentCard;
