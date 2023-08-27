// Hooks.
import { useSelector } from "react-redux";
// Components.
import {
  useColorMode,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Component.
function PollCard({ dataPolls }) {
  const [polls, setPolls] = useState(null);

  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  useEffect(() => {
    if (dataPolls) {
      setPolls(dataPolls.polls);
    }
  }, [dataPolls]);

  return (
    <>
      <Box display={"flex"} flexDir={"column"} alignItems={"center"}>
        {polls ? (
          polls.map((poll, index) => (
            <Card
              key={index}
              color={isDark ? `${color}.text-d-p` : `${color}.900`}
              w={"100%"}
              bg={isDark ? `black` : `${color}.bg-l-p`}
              maxW="xl"
            >
              {/* Card Header. */}
              <CardHeader>
                <Flex spacing="4">
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar name={poll.created_by.username} />

                    <Box>
                      <Heading size="sm">{poll.created_by.first_name}</Heading>
                      <Text opacity={0.5} fontWeight="hairline" fontSize="sm">
                        @{poll.created_by.username}
                      </Text>
                    </Box>
                  </Flex>
                  <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="See menu"
                    bg={"gray"}
                  />
                </Flex>
              </CardHeader>

              {/* Card Body. */}
              <CardBody>
                <Stack spacing={3}>
                  <Heading textAlign={"center"} size="md">
                    {poll.title}
                  </Heading>
                  <Text textAlign={"center"} fontSize={"md"} opacity={0.8}>
                    {poll.description}
                  </Text>
                  <Stack w={"100%"}>
                    <Button
                      bg={
                        isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`
                      }
                      color={isDark ? `${color}.text-d-p` : `${color}.900`}
                      colorScheme={color}
                      justifyContent="start"
                      variant="ghost"
                      opacity={isDark ? 0.8 : 0.6}
                    >
                      Like
                    </Button>
                    <Button
                      bg={
                        isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`
                      }
                      color={isDark ? `${color}.text-d-p` : `${color}.900`}
                      colorScheme={color}
                      justifyContent="start"
                      variant="ghost"
                      opacity={isDark ? 0.8 : 0.6}
                    >
                      Hola com estas
                    </Button>
                    <Button
                      bg={
                        isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`
                      }
                      color={isDark ? `${color}.text-d-p` : `${color}.900`}
                      colorScheme={color}
                      justifyContent="start"
                      variant="ghost"
                      opacity={isDark ? 0.8 : 0.6}
                    >
                      quedo
                    </Button>
                  </Stack>
                </Stack>
              </CardBody>

              {/* Card Footer. */}
              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "136px",
                  },
                }}
              >
                <Button flex="1" variant="ghost">
                  Like
                </Button>
                <Button flex="1" variant="ghost">
                  Comment
                </Button>
                <Button flex="1" variant="ghost">
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No polls available.</p>
        )}
      </Box>
    </>
  );
}

export default PollCard;
