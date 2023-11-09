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
  const { token, user, profile } = useSelector((state) => state.session);

  const [commentLength, setCommentLength] = useState(0);

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
    if (comment.length > 143) {
      setValue("comment", comment.slice(0, -1));
    } else {
      setCommentLength(comment.length);
    }
  }, [isWriting]);

  // Add Comment onSubmit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await addComment({
        headers: { Authorization: `Token ${token}` },
        id: id,
        body: data,
      });
      if (res.data) {
        setValue("comment", "");
      }

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

  return (
    <form onSubmit={onSubmit}>
      <Card
        bg={isDark ? "black" : "white"}
        w="100%"
        direction={"row"}
        borderRadius="0"
        borderBottom={"1px solid"}
        borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
      >
        <CardHeader as={Flex} pr={3}>
          {/* Profile Picture. */}
          <Flex flex="1" gap="3" minH={"36px"}>
            <Box h={"100%"}>
              <NavLink to={`/${user.username}`}>
                <IconButton isDisabled={isLoading} variant={"unstyled"}>
                  <Avatar
                    src={profile.profile_picture}
                    size={"md"}
                    h={"42px"}
                    w={"42px"}
                    bg={"gray.400"}
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
                focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
                minH="50px"
                h={isWriting ? "85px" : "auto"}
                onBlur={() => clearErrors()}
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
                  <Text opacity={0.5}>{commentLength} / 143</Text>
                </HStack>
              )}
              <HStack>
                {isWriting && (
                  <Button
                    size={"sm"}
                    borderRadius={"full"}
                    isDisabled={isLoading}
                    onClick={() => setValue("comment", "")}
                  >
                    <Text fontWeight={"bold"}>Cancel</Text>
                  </Button>
                )}
                <Button
                  type="submit"
                  size={"sm"}
                  variant={"solid"}
                  colorScheme={ThemeColor}
                  borderRadius={"full"}
                  isLoading={isLoading}
                  isDisabled={!isWriting}
                  loadingText={<Text fontWeight={"bold"}>Comment</Text>}
                >
                  <Text fontWeight={"bold"}>Comment</Text>
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
