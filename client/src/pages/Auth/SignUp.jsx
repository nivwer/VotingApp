// Hooks.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../api/authApiSlice";
// Actions.
import { login } from "../../features/auth/authSlice";
// Components.
import {
  useColorMode,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";

// Icons.
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

// Page.
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  // Request to the backend.
  const [signUp, { isLoading, isError }] = useSignUpMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm({
    criteriaMode: "all",
  });

  // Show Password fields.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signUp(data);
      // If the registration is valid.
      if (res.data) {
        dispatch(
          login({
            token: res.data.token,
            user: res.data.user,
            profile: res.data.profile,
          })
        );
        navigate("/home");
      }

      // If server error.
      if (res.error) {
        const errorData = res.error.data;

        for (const fieldName in errorData) {
          const errorMessage = errorData[fieldName][0];

          setError(fieldName, {
            message: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Container maxW="xl">
        <Center minH="calc(100vh - 200px)">
          <Box
            w={"100%"}
            bg={isDark ? "black" : `${color}.bg-l-s`}
            color={isDark ? `${color}.text-d-p` : `${color}.900`}
            outline={isDark ? "1px solid" : "2px solid"}
            outlineColor={isDark ? `${color}.border-d` : `${color}.600`}
            borderRadius="14px"
            textAlign="center"
          >
            {isLoading && (
              <Progress
                colorScheme={color}
                borderTopRadius="14px"
                m="auto"
                w={"98%"}
                size="xs"
                isIndeterminate
              />
            )}
            <Box p="14" pb="10" px="8%">
              {/* Create user form. */}
              <form onSubmit={onSubmit}>
                <Stack spacing={8}>
                  <Text fontSize="3xl" fontWeight="bold">
                    Sign Up
                  </Text>
                  <Stack textAlign="start" spacing={3}>
                    {/* username. */}
                    <FormControl
                      isDisabled={isLoading}
                      isInvalid={errors.username}
                    >
                      <FormLabel fontWeight={"bold"} htmlFor="username">
                        Username
                      </FormLabel>
                      <Input
                        focusBorderColor={isDark ? `${color}.border-d` : `${color}.600`}
                        placeholder="Username"
                        {...register("username", {
                          required: {
                            value: true,
                            message: "This field is required.",
                          },
                          maxLength: {
                            value: 32,
                            message: "Maximum 32 options allowed.",
                          },
                          minLength: {
                            value: 3,
                            message: "Minimum 3 options allowed.",
                          },
                        })}
                        type="text"
                      />
                      {/* Handle errors. */}
                      {errors.username && (
                        <FormErrorMessage>
                          {errors.username.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    {/* Password. */}
                    <FormControl
                      isDisabled={isLoading}
                      isInvalid={errors.password}
                    >
                      <FormLabel fontWeight={"bold"} htmlFor="password">
                        Password
                      </FormLabel>
                      <InputGroup size="md">
                        <Input
                          focusBorderColor={isDark ? `${color}.border-d` : `${color}.600`}
                          placeholder="Password"
                          {...register("password", {
                            required: {
                              value: true,
                              message: "This field is required.",
                            },
                            maxLength: {
                              value: 96,
                              message: "Maximum 96 options allowed.",
                            },
                            minLength: {
                              value: 8,
                              message: "Minimum 8 options allowed.",
                            },
                          })}
                          type={showPassword ? "text" : "password"}
                        />
                        <InputRightElement width="3rem">
                          <Button
                            isDisabled={isLoading}
                            colorScheme={color}
                            variant={"unstyled"}
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && (
                        <FormErrorMessage>
                          {errors.password.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    {/* Password Validation. */}
                    <FormControl
                      isDisabled={isLoading}
                      isInvalid={errors.passwordValidation}
                    >
                      <FormLabel
                        fontWeight={"bold"}
                        htmlFor="passwordValidation"
                      >
                        Confirm Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          focusBorderColor={isDark ? `${color}.border-d` : `${color}.600`}
                          placeholder="Confirm password"
                          {...register("passwordValidation", {
                            required: {
                              value: true,
                              message: "This field is required.",
                            },
                            validate: (value) =>
                              value === watch("password") ||
                              "Password not match.",
                          })}
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        <InputRightElement width="3rem">
                          <Button
                            isDisabled={isLoading}
                            colorScheme={color}
                            variant={"unstyled"}
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                              setShowConfirmPassword(!showConfirmPassword);
                            }}
                          >
                            {showConfirmPassword ? (
                              <ViewIcon />
                            ) : (
                              <ViewOffIcon />
                            )}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      {errors.passwordValidation && (
                        <FormErrorMessage>
                          {errors.passwordValidation.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </Stack>
                  <Flex justifyContent="center">
                    <Button
                      isDisabled={isLoading}
                      type="submit"
                      colorScheme={color}
                      variant="solid"
                      opacity={isDark ? 0.8 : 1}
                    >
                      Sign Up
                    </Button>
                  </Flex>
                </Stack>
              </form>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
}

export default SignUp;
