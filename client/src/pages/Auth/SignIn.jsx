// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../api/authApiSlice";
// Actions.
import { login } from "../../features/auth/sessionSlice";
//Components.
import CustomProgress from "../../components/Progress/CustomProgress";
import {
  Container,
  Center,
  Flex,
  FormErrorMessage,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
// Styles.
import { getAuthStyles } from "./AuthStyles";
// Icons.
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";

// Page.
function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getAuthStyles(ThemeColor, isDark);
  // Request to the backend.
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
      <Container maxW="md">
        <Center minH="calc(100vh - 200px)">
          <Box {...styles.content}>
            {isLoading && <CustomProgress />}
            <Box p="14" pb="10" px="8%">
              {/* Login user form. */}
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
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Username is required.",
                          },
                        })}
                        type="text"
                        placeholder="Username"
                        focusBorderColor={styles.focusBorderColor}
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
                          {...register("password", {
                            required: {
                              value: true,
                              message: "Password is required.",
                            },
                          })}
                          fontFamily={"heading"}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          focusBorderColor={styles.focusBorderColor}
                        />
                        <InputRightElement width="3rem">
                          <IconButton
                            borderRadius={"full"}
                            isDisabled={isLoading}
                            colorScheme={"default"}
                            variant={"unstyled"}
                            h="1.75rem"
                            size="sm"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                          </IconButton>
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
                      colorScheme={"default"}
                      variant="solid"
                      opacity={isDark ? 0.9 : 1}
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
