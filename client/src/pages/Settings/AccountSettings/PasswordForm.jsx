// Hooks.
import { useForm } from "react-hook-form";
import { useUpdatePasswordMutation } from "../../../api/authApiSlice";
import { useThemeInfo } from "../../../hooks/Theme";
import { useState } from "react";
import { useSelector } from "react-redux";
// Components.
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import ToggleShowPassword from "../../../components/Toggles/ShowPassword/ToggleShowPassword";

// Component.
function PasswordForm() {
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // Request to update password.
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  // Show Password fields.
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Update password onSubmit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updatePassword({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        body: data,
      });
      if (res.data) {
        setValue("new_password", "");
        setValue("current_password", "");
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
    <Box py={1} px={2}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Stack spacing={4}>
            {/* Password. */}
            <FormControl
              isDisabled={isLoading}
              isInvalid={errors.current_password}
            >
              <FormLabel fontWeight={"bold"} htmlFor="current_password">
                Password
              </FormLabel>
              <InputGroup size="sm">
                <Input
                  {...register("current_password", {
                    required: "This field is required.",
                  })}
                  placeholder="Current password"
                  type={showPassword ? "text" : "password"}
                  size={"sm"}
                  fontWeight={"medium"}
                  borderRadius={"md"}
                  focusBorderColor={
                    isDark ? "whiteAlpha.600" : "blackAlpha.700"
                  }
                />
                <InputRightElement width="3rem">
                  <ToggleShowPassword
                    isLoading={isLoading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.current_password && (
                <FormErrorMessage>
                  {errors.current_password.message}
                </FormErrorMessage>
              )}
            </FormControl>
            {/* New password. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.new_password}>
              <FormLabel fontWeight={"bold"} htmlFor="new_password">
                New password
              </FormLabel>
              <InputGroup size={"sm"}>
                <Input
                  {...register("new_password", {
                    required: "This field is required.",
                  })}
                  placeholder="New password"
                  type={showNewPassword ? "text" : "password"}
                  size={"sm"}
                  fontWeight={"medium"}
                  borderRadius={"md"}
                  focusBorderColor={
                    isDark ? "whiteAlpha.600" : "blackAlpha.700"
                  }
                />
                <InputRightElement width="3rem">
                  <ToggleShowPassword
                    isLoading={isLoading}
                    showPassword={showNewPassword}
                    setShowPassword={setShowNewPassword}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.new_password && (
                <FormErrorMessage>
                  {errors.new_password.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
          <Box>
            <Button
              isLoading={isLoading}
              loadingText="Save password"
              size={"sm"}
              type="submit"
            >
              Save password
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default PasswordForm;
