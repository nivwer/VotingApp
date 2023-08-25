// Hooks.
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../api/authApiSlice";
// Actions.
import { login } from "../features/auth/authSlice";
//Components.
import {
  Container,
  Center,
  Flex,
  FormErrorMessage,
  FormHelperText,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorMode,
  InputGroup,
  InputRightElement,
  Progress,
} from "@chakra-ui/react";
// Icons.
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

// Page.
function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // asd
  const [signIn, { isLoading, isError }] = useSignInMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Show Password field.
  const [showPassword, setShowPassword] = useState(false);

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn(data);
      // If the authentication is valid.
      if (res.data) {
        dispatch(
          login({
            token: res.data.token,
            user: res.data.user,
          })
        );
        navigate("/home");
      }

      if (res.error) {
        if (res.error.data.username) {
          setError("username", {
            message: res.error.data.username[0],
          });
        } else if (res.error.data.password) {
          setError("password", {
            message: res.error.data.password[0],
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Container maxW="md">
        <Center minH="calc(100vh - 200px)">
          <Box
            w={"100%"}
            bg={isDark ? `black` : `${color}.25`}
            outline={isDark ? "1px solid" : "2px solid"}
            outlineColor={isDark ? `${color}.200` : `${color}.500`}
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
              <form onSubmit={onSubmit}>
                <Stack spacing={6}>
                  <Text fontSize="3xl" fontWeight="bold">
                    Sign In
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
                        focusBorderColor={
                          isDark ? `${color}.200` : `${color}.500`
                        }
                        placeholder="Username"
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Username is required.",
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
                          focusBorderColor={
                            isDark ? `${color}.200` : `${color}.500`
                          }
                          placeholder="Password"
                          {...register("password", {
                            required: {
                              value: true,
                              message: "Password is required.",
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
                  </Stack>
                  <Flex justifyContent="center">
                    <Button
                      isDisabled={isLoading}
                      type="submit"
                      colorScheme={color}
                      variant="solid"
                    >
                      Sign In
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

export default SignIn;
