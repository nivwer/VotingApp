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
  Stack,
  Text,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// Component.
function PollCommentCard({ comment }) {
  const { isDark } = useThemeInfo();
  const isLoading = false;
  return (
    <>
      <Card
        bg={isDark ? "black" : "white"}
        w="100%"
        borderRadius="0"
        borderBottom={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
      >
        {/* Card Header. */}
        <CardHeader as={Flex} pb={0} spacing={"4"}>
          <Flex flex="1" gap="3">
            {/* Profile Picture. */}
            <Box h={"100%"}>
              <NavLink to={`/${comment.user_profile.username}`}>
                <IconButton isDisabled={isLoading} variant={"unstyled"}>
                  <Avatar
                    src={comment.user_profile.profile_picture}
                    size={"md"}
                    bg={"gray.400"}
                  />
                </IconButton>
              </NavLink>
            </Box>

            <Stack fontSize={"md"} spacing={0}>
              <HStack spacing={1}>
                {/* Profile Name. */}
                <NavLink to={`/${comment.user_profile.username}`}>
                  <Text fontWeight={"black"} opacity={isDark ? 1 : 0.9}>
                    {comment.user_profile.profile_name}
                  </Text>
                </NavLink>
                {/* Username. */}
                <NavLink to={`/${comment.user_profile.username}`}>
                  <Text fontWeight={"normal"} opacity={0.5}>
                    @{comment.user_profile.username}
                  </Text>
                </NavLink>
                <HStack
                  spacing={1}
                  fontSize="sm"
                  fontWeight="semibold"
                  opacity={0.5}
                >
                  {/* Divider. */}
                  <Text>·</Text>
                  {/* Time Ago. */}
                  {/* <Text>{timeAgo}</Text> */}
                </HStack>
              </HStack>
            </Stack>
          </Flex>
        </CardHeader>

        {/* Card Body. */}
        <CardBody pt={0}>
          <Flex pl={14}>
            <Text px={2} w={"auto"} wordBreak={"break-all"}>
              {comment.comment}
            </Text>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}

export default PollCommentCard;
