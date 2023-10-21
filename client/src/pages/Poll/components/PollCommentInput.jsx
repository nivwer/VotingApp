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

// Component.
function PollCommentInput({ id }) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { token, user, profile } = useSelector((state) => state.session);

  const [addComment, { isLoading }] = useAddCommentMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

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
    <Card
      bg={isDark ? "black" : "white"}
      w="100%"
      direction={"row"}
      borderRadius="0"
      borderBottom={"1px solid"}
      borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
    >
      <CardHeader as={Flex} spacing={"4"}>
        {/* Profile Picture. */}
        <Flex flex="1" gap="3">
          <Box h={"100%"}>
            <NavLink to={`/${profile.username}`}>
              <IconButton isDisabled={isLoading} variant={"unstyled"}>
                <Avatar
                  src={profile.profile_picture}
                  size={"md"}
                  bg={"gray.400"}
                />
              </IconButton>
            </NavLink>
          </Box>
        </Flex>
      </CardHeader>

      <Stack w={"100%"} spacing={0}>
        <form onSubmit={onSubmit}>
          <CardBody p={0} pr={5} pt={5} pl={0}>
            <FormControl isDisabled={isLoading} isInvalid={errors.comment}>
              <FormLabel fontWeight={"bold"} htmlFor="comment"></FormLabel>
              <Textarea
                {...register("comment", {
                  required: "This field is required.",
                })}
                placeholder="Write your comment"
                fontWeight={"medium"}
                borderRadius={"md"}
                p={1}
                variant={"unstyled"}
                resize={"none"}
                focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
              />
              {errors.comment && (
                <FormErrorMessage>{errors.comment.message}</FormErrorMessage>
              )}
            </FormControl>
          </CardBody>

          <CardFooter py={2} pb={5} pr={10}>
            <Flex w={"100%"} justify={"end"}>
              <Button
                type="submit"
                size={"sm"}
                variant={"solid"}
                colorScheme={ThemeColor}
                borderRadius={"full"}
                isLoading={isLoading}
                loadingText={<Text fontWeight={"bold"}>Comment</Text>}
              >
                <Text fontWeight={"bold"}>Comment</Text>
              </Button>
            </Flex>
          </CardFooter>
        </form>
      </Stack>
    </Card>
  );
}

export default PollCommentInput;
