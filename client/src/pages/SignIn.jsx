// Hooks.
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../api/authApiSlice";
// Actions.
import { login } from "../features/auth/authSlice";
//Components.
import { Container, Center, Flex } from "@chakra-ui/react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";

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
    watch,
    formState: { errors },
  } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn(data);

      dispatch(
        login({
          token: res.data.token,
          user: res.data.user,
        })
      );

      navigate("/user/polls");
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <Container maxW="sm">
        <Center h="100vh">
          <Box
            p="10"
            px="14"
            bg={isDark ? `black` : `${color}.25` }
            outline={isDark ? "1px solid" : "2px solid"}
            outlineColor={isDark ? `${color}.200` : `${color}.500`}
            borderRadius="14px"
            textAlign="center"
          >
            <form>
              <Stack spacing={6}>
                <Text fontSize="3xl" fontWeight="bold">
                  Sign In
                </Text>
                <Stack spacing={3}>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input type="text" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" />
                  </FormControl>
                </Stack>
                <Flex justifyContent="center">
                  <Button type="submit" 
                  colorScheme={color}
                  variant="solid">Sign In</Button>
                </Flex>
              </Stack>
            </form>

            {/* <form onSubmit={onSubmit}> */}
            {/* Name. */}
            {/* <label htmlFor="username">Username</label>
              <input
                {...register("username", {
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                  minLength: {
                    value: 4,
                    message: "Min 4 digits",
                  },
                })}
                type="text"
              /> */}
            {/* Handle errors. */}
            {errors.name && <span>{errors.name.message}</span>}

            {/* Password. */}
            {/* <label htmlFor="password">Password</label>
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                type="password"
              /> */}
            {/* Handle errors. */}
            {/* {errors.password && <span>{errors.password.message}</span>}
              <button type="submit">Submit</button>
            </form> */}
          </Box>
        </Center>
      </Container>
    </>
  );
}

export default SignIn;
