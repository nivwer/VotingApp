import { useThemeInfo } from "../../../hooks/Theme";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import CustomButton from "../../Buttons/CustomButton/CustomButton";
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
import Cookies from "js-cookie";

function CommentInput({ id, useAddCommentMutation }) {
  const csrftoken = Cookies.get("csrftoken");
  const { isDark, ThemeColor } = useThemeInfo();
  const { isAuthenticated, user, profile } = useSelector((state) => state.session);
  const [commentLength, setCommentLength] = useState(0);
  const [dataMutation, setDataMutation] = useState(false);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const { register, handleSubmit, formState, setError, setValue, watch, clearErrors } = useForm();
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
      if (res.data) setValue("comment", "");
      if (res.error && res.error.data) {
        for (const fieldName in res.error.data) {
          setError(fieldName, { message: res.error.data[fieldName][0] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
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
            <FormControl isDisabled={isLoading} isInvalid={formState.errors.comment}>
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
                  color: isDark ? "gothicPurple.100" : "gothicPurple.900",
                  opacity: isDark ? 0.2 : 0.3,
                }}
              />
              {formState.errors.comment && (
                <FormErrorMessage children={formState.errors.comment.message} />
              )}
            </FormControl>
          </CardBody>

          <CardFooter py={isWriting ? 2 : "auto"} pb={5} pl={0} pr={10}>
            <Flex w={"100%"} justify={"space-between"}>
              {isWriting && (
                <HStack fontSize={"sm"} fontWeight={"bold"}>
                  <Text
                    color={isDark ? "gothicPurple.100" : "gothicPurple.900"}
                    opacity={isDark ? 0.2 : 0.3}
                    children={`${commentLength} / 143`}
                  />
                </HStack>
              )}
              <HStack>
                {isWriting && (
                  <CustomButton
                    size={"sm"}
                    isDisabled={isLoading}
                    p={4}
                    onClick={() => setValue("comment", "")}
                    children={"Cancel"}
                  />
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
                  children={"Comment"}
                />
              </HStack>
            </Flex>
          </CardFooter>
        </Stack>
      </Card>
    </form>
  );
}

export default CommentInput;
