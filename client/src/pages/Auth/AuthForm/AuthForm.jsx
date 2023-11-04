// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useState } from "react";
// Components.
import CustomProgress from "../../../components/Progress/CustomProgress/CustomProgress";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
// Icons.
import ToggleShowPassword from "../../../components/Toggles/ToggleShowPassword/ToggleShowPassword";

// Page.
function AuthForm({
  isSignUp = false,
  register,
  onSubmit,
  isLoading,
  errors,
  watch,
}) {
  const { isDark } = useThemeInfo();

  // Show Password fields.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const focusBorderColor = isDark ? "whiteAlpha.600" : "blackAlpha.700";

  return (
    <Box
      w={"100%"}
      color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      outline={"1px solid"}
      outlineColor={isDark ? "whiteAlpha.300" : "blackAlpha.600"}
      borderRadius={"xl"}
      textAlign={"center"}
    >
      {isLoading && <CustomProgress />}
      {/* Form */}
      <form onSubmit={onSubmit}>
        <Stack spacing={6} p="14" pb="10" px="8%">
          <Heading fontSize={"4xl"}>{isSignUp ? "Sign Up" : "Sign In"}</Heading>
          <Stack textAlign="start" spacing={3}>
            {/* username. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.username}>
              <FormLabel fontWeight={"bold"} htmlFor="username">
                Username
              </FormLabel>
              <Input
                {...register("username", {
                  required: "This field is required.",
                })}
                type="text"
                placeholder="Username"
                focusBorderColor={focusBorderColor}
              />
              {/* Handle errors. */}
              {errors.username && (
                <FormErrorMessage>{errors.username.message}</FormErrorMessage>
              )}
            </FormControl>

            {/* Password. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.password}>
              <FormLabel fontWeight={"bold"} htmlFor="password">
                Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  {...register("password", {
                    required: "This field is required.",
                  })}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  focusBorderColor={focusBorderColor}
                />
                <InputRightElement width="3rem">
                  <ToggleShowPassword
                    isLoading={isLoading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>

            {/* Password Validation. */}
            {isSignUp && (
              <FormControl
                isDisabled={isLoading}
                isInvalid={errors.passwordValidation}
              >
                <FormLabel fontWeight={"bold"} htmlFor="passwordValidation">
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    {...register("passwordValidation", {
                      required: "This field is required.",
                      validate: (value) =>
                        value === watch("password") || "Password not match.",
                    })}
                    placeholder="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    focusBorderColor={focusBorderColor}
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
                  <FormErrorMessage>
                    {errors.passwordValidation.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
          </Stack>

          {/* Submit. */}
          <Flex justifyContent="center">
            <Button
              isDisabled={isLoading}
              type="submit"
              colorScheme={"default"}
              variant={"solid"}
              opacity={isDark ? 0.9 : 1}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
}

export default AuthForm;
