import { useThemeInfo } from "../../../hooks/Theme";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import ToggleShowPassword from "../../../components/Toggles/ToggleShowPassword/ToggleShowPassword";
import CustomTextInput from "../../../components/Form/CustomTextInput/CustomTextInput";
import { NavLink } from "react-router-dom";

function AuthForm({ isSignUp = false, register, onSubmit, isLoading, errors, watch }) {
  const { ThemeColor } = useThemeInfo();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Box
    my={4}
      w={"100%"}
      borderRadius={"3xl"}
      textAlign={"center"}
      outline={"1px solid"}
      outlineColor={{ base: "transparent", sm: "gothicPurpleAlpha.300" }}
    >
      <form onSubmit={onSubmit}>
        <Stack spacing={7} p={16} px={{ base: 2, sm: 14 }} align={"center"}>
          <Text children={isSignUp ? "Sign Up" : "Sign In"} fontSize={"4xl"} fontWeight={"bold"} />
          <Stack spacing={5} maxW={"300px"}>
            {/* username. */}
            <FormControl isInvalid={errors.username} isDisabled={isLoading}>
              {/* <FormLabel children={"Username"} htmlFor="username" fontWeight={"bold"} /> */}
              <CustomTextInput
                name={"username"}
                placeholder="Username"
                register={register}
                requirements={{ req: true }}
              />
              {errors.username && <FormErrorMessage children={errors.username.message} />}
            </FormControl>

            {/* Password. */}
            <FormControl isInvalid={errors.password} isDisabled={isLoading}>
              {/* <FormLabel children={"Password"} htmlFor="password" fontWeight={"bold"} /> */}
              <InputGroup size="md">
                <CustomTextInput
                  name={"password"}
                  placeholder="Password"
                  register={register}
                  requirements={{ req: true }}
                  type={showPassword ? "text" : "password"}
                  pr={"40px"}
                />
                <InputRightElement width="3rem">
                  <ToggleShowPassword
                    isLoading={isLoading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && <FormErrorMessage children={errors.password.message} />}
            </FormControl>

            {/* Password Validation. */}
            {isSignUp && (
              <FormControl isInvalid={errors.passwordValidation} isDisabled={isLoading}>
                {/* <FormLabel htmlFor="passwordValidation" fontWeight={"bold"}>
                  Confirm Password
                </FormLabel> */}
                <InputGroup>
                  <CustomTextInput
                    name={"passwordValidation"}
                    placeholder="Confirm password"
                    register={register}
                    requirements={{
                      req: true,
                      validate: (value) => value === watch("password") || "Password not match.",
                    }}
                    type={showConfirmPassword ? "text" : "password"}
                    pr={"40px"}
                  />
                  <InputRightElement width="3rem">
                    <ToggleShowPassword
                      isLoading={isLoading}
                      showPassword={showConfirmPassword}
                      setShowPassword={setShowConfirmPassword}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.passwordValidation && (
                  <FormErrorMessage children={errors.passwordValidation.message} />
                )}
              </FormControl>
            )}
            {/* Submit. */}
            <Flex justifyContent="center">
              <Button
                type="submit"
                isLoading={isLoading}
                loadingText={isSignUp ? "Sign Up" : "Sign In"}
                colorScheme={ThemeColor}
                borderRadius={"full"}
                px={"28px"}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </Flex>

            <HStack justify={"center"}>
              <Text opacity={0.7}>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </Text>
              <NavLink to={isSignUp ? "/signin" : "/signup"}>
                <Button variant={"link"}>{isSignUp ? "Sign In" : "Sign Up"}</Button>
              </NavLink>
            </HStack>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}

export default AuthForm;
