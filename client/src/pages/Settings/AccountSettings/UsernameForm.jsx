// Hooks.
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../hooks/Theme";
import { useForm } from "react-hook-form";
// Components.
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useUpdateUsernameMutation } from "../../../api/authApiSlice";

// Component.
function UsernameForm() {
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);

  // Request to update username.
  const [updateUsername, { isLoading }] = useUpdateUsernameMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Update username onSubmit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateUsername({
        headers: {
          Authorization: `Token ${session.token}`,
        },
        body: data,
      });
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
    <Box px={"5"}>
      <form onSubmit={onSubmit}>
        <FormControl isDisabled={isLoading} isInvalid={errors.new_username}>
          <FormLabel fontWeight={"bold"} htmlFor="new_username">
            Username
          </FormLabel>
          <Input
            defaultValue={session.user.username}
            {...register("new_username", {
              required: "This field is required.",
            })}
            type="text"
            placeholder="Change username"
            focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
          />
          {/* Handle errors. */}
          {errors.new_username && (
            <FormErrorMessage>{errors.new_username.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button type="submit">submit</Button>
      </form>
    </Box>
  );
}

export default UsernameForm;
