// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import {
  Avatar,
  Box,
  Card,
  CardBody,
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

// Component.
function PollCommentCard({ comment }) {
  const { isDark } = useThemeInfo();
  const isLoading = false;

  // Time Ago.
  const creationDate = new Date(comment.creation_date);
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
        borderBottom={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        direction={"row"}
      >
        {/* Card Header. */}
        <CardHeader as={Flex} py={4} spacing={"4"} pr={3}>
          {/* Profile Picture. */}
          <Flex flex="1" gap="3" minH={"48px"}>
            <Box h={"100%"}>
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
            </Box>
          </Flex>
        </CardHeader>

        {/* Card Body. */}
        <CardBody  py={4}  pl={0}>
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
            <HStack
              my={"auto"}
              h={"90%"}
              align={"end"}
              spacing={1}
              fontWeight="medium"
              opacity={0.5}
            >
              {/* Divider. */}
              <Text>·</Text>
              {/* Time Ago. */}
              <Text>{timeAgo}</Text>
            </HStack>
          </HStack>

          <Flex pl={0} fontSize={"md"}>
            <Text
              opacity={0.8}
              w={"auto"}
              fontWeight={"normal"}
              wordBreak={"break-word"}
            >
              {comment.comment}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}

export default PollCommentCard;
