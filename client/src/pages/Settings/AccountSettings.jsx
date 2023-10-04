// Hooks.
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../hooks/Theme";
import { useState } from "react";
// Components.
import ToggleShowPassword from "../../components/Toggles/ShowPassword/ToggleShowPassword";
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";

// Page.
function AccountSettings() {
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Show Password fields.
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isLoading = false;
  const focusBorderColor = isDark ? "whiteAlpha.600" : "blackAlpha.700";

  return (
    <Box w={"100%"} p={"10"}>
      <Stack spacing={7}>
        <Heading textAlign={"center"} size={"lg"}>
          Account
        </Heading>
        <Divider />
        {/* username. */}
        <Box px={"5"}>
          <form>
            <FormControl isDisabled={isLoading} isInvalid={errors.username}>
              <FormLabel fontWeight={"bold"} htmlFor="username">
                Username
              </FormLabel>
              <Input
                defaultValue={session.user.username}
                {...register("username", {
                  required: "This field is required.",
                })}
                type="text"
                placeholder="Change username"
                focusBorderColor={focusBorderColor}
              />
              {/* Handle errors. */}
              {errors.username && (
                <FormErrorMessage>{errors.username.message}</FormErrorMessage>
              )}
            </FormControl>
          </form>
        </Box>
        <Divider />
        <Box px={"5"}>
          <form>
            <Stack spacing={4}>
              <FormControl isDisabled={isLoading} isInvalid={errors.password}>
                <FormLabel fontWeight={"bold"} htmlFor="password">
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    {...register("password", {
                      required: "This field is required.",
                    })}
                    placeholder="Change password"
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
            </Stack>
          </form>
        </Box>
      </Stack>
    </Box>
  );
}

export default AccountSettings;
