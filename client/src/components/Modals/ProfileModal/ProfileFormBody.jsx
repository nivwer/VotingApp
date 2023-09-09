// Hooks.
import { FormControl, FormErrorMessage, FormLabel, Input, Stack } from "@chakra-ui/react";
import { useThemeInfo } from "../../../hooks/Theme";
// Components.

// Component.
function ProfileFormBody({
  profile,
  register,
  errors,
  styles,
  isLoading,
}) {
  const { ThemeColor, isDark } = useThemeInfo();
  return (
    <>
      <Stack textAlign="start" spacing={3}>
        {/* Title. */}
        <FormControl isDisabled={isLoading} isInvalid={errors.profile_name}>
          <FormLabel htmlFor="profile_name" fontWeight={"bold"}>
            Name
          </FormLabel>
          <Input
            {...register("profile_name", {
              required: {
                value: true,
                message: "This field is required.",
              },
              minLength: {
                value: 3,
                message: "Minimum 3 characters allowed.",
              },
              maxLength: {
                value: 32,
                message: "Maximum 32 characters allowed.",
              },
            })}
            type="text"
            defaultValue={profile.profile_name}
            placeholder="Enter your name."
            focusBorderColor={styles.focusBorderColor}
          />
          {/* Handle errors. */}
          {errors.profile_name && (
            <FormErrorMessage>{errors.profile_name.message}</FormErrorMessage>
          )}
        </FormControl>
      </Stack>
    </>
  );
}

export default ProfileFormBody;
