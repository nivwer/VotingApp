// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAddCommentMutation } from "../../../api/pollApiSlice";
// Components.
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

// Component.
function CommentInput({ id }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, token, user, profile } = useSelector(
    (state) => state.session
  );
  const [commentLength, setCommentLength] = useState(0);
  const [dataMutation, setDataMutation] = useState(false);

  const [addComment, { isLoading }] = useAddCommentMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors,
  } = useForm();

  const isWriting = watch("comment");

  useEffect(() => {
    const comment = watch("comment");
    comment.length > 143
      ? setValue("comment", comment.slice(0, -1))
      : setCommentLength(comment.length);
  }, [isWriting]);

  // Add Comment onSubmit.
  const onSubmit = handleSubmit(async (data) => {
    const body = { body: data };
    try {
      const res = await addComment({ ...dataMutation, ...body });
      res.data && setValue("comment", "");

      // If server error.
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, { message: res.error.data[fieldName][0] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Update data to mutations.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataMutation({ ...headers, id: id });
  }, [id, isAuthenticated]);

  return (
    <form onSubmit={onSubmit}>
      <Card
        bg={isDark ? "black" : "white"}
        w="100%"
        direction={"row"}
        borderBottom={"3px solid"}
        borderRadius={"3px"}
        borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
        boxShadow={"none"}
        mb={3}
      >
        <CardHeader as={Flex} pr={3}>
          {/* Profile Picture. */}
          <Flex flex="1" gap="3" minH={"36px"}>
            <Box h={"100%"}>
              <NavLink to={`/${user.username}`}>
                <IconButton isDisabled={isLoading} variant={"unstyled"}>
                  <Avatar
                    src={profile.profile_picture}
                    bg={profile.profile_picture ? "transparent" : "gray.400"}
                    size={"md"}
                    h={"42px"}
                    w={"42px"}
                  />
                </IconButton>
              </NavLink>
            </Box>
          </Flex>
        </CardHeader>

        <Stack w={"100%"} spacing={0} flexDir={isWriting ? "column" : "row"}>
          <CardBody p={0} pr={10} pt={5} pl={0}>
            <FormControl isDisabled={isLoading} isInvalid={errors.comment}>
              <FormLabel fontWeight={"bold"} htmlFor="comment"></FormLabel>
              <Textarea
                {...register("comment", { required: true })}
                placeholder="Write your comment"
                fontWeight={"medium"}
                fontSize={"lg"}
                borderRadius={"md"}
                p={1}
                variant={"unstyled"}
                resize={"none"}
                opacity={0.9}
                focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                minH="50px"
                h={isWriting ? "85px" : "auto"}
                onBlur={() => clearErrors()}
                _placeholder={{
                  color: isDark ? "gothicPurple.100" : "gothicPurple.600",
                  opacity: isDark ? 0.4 : 0.5,
                }}
              />
              {errors.comment && (
                <FormErrorMessage>{errors.comment.message}</FormErrorMessage>
              )}
            </FormControl>
          </CardBody>

          <CardFooter py={isWriting ? 2 : "auto"} pb={5} pl={0} pr={10}>
            <Flex w={"100%"} justify={"space-between"}>
              {isWriting && (
                <HStack fontSize={"sm"} fontWeight={"bold"}>
                  <Text
                    color={isDark ? "gothicPurple.100" : "gothicPurple.600"}
                    opacity={isDark ? 0.4 : 0.5}
                  >
                    {commentLength} / 143
                  </Text>
                </HStack>
              )}
              <HStack>
                {isWriting && (
                  <Button
                    size={"sm"}
                    borderRadius={"full"}
                    isDisabled={isLoading}
                    opacity={0.8}
                    color={isDark ? "white" : "black"}
                    colorScheme="gothicPurpleAlpha"
                    p={4}
                    onClick={() => setValue("comment", "")}
                  >
                    <Text fontWeight={"extrabold"}>Cancel</Text>
                  </Button>
                )}
                <Button
                  type="submit"
                  size={"sm"}
                  variant={"solid"}
                  opacity={0.9}
                  colorScheme={ThemeColor}
                  borderRadius={"full"}
                  p={4}
                  isLoading={isLoading}
                  isDisabled={!isWriting}
                  loadingText={<Text fontWeight={"extrabold"}>Comment</Text>}
                >
                  <Text fontWeight={"extrabold"}>Comment</Text>
                </Button>
              </HStack>
            </Flex>
          </CardFooter>
        </Stack>
      </Card>
    </form>
  );
}

export default CommentInput;
