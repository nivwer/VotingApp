import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUpdatePasswordMutation } from "../../../../../api/accountsAPISlice";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import ToggleShowPassword from "../../../../../components/Toggles/ToggleShowPassword/ToggleShowPassword";
import CustomTextInput from "../../../../../components/Form/CustomTextInput/CustomTextInput";
import CustomButton from "../../../../../components/Buttons/CustomButton/CustomButton";
import Cookies from "js-cookie";

function PasswordForm() {
  const csrftoken = Cookies.get("csrftoken");
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const { register, handleSubmit, formState, setError, setValue } = useForm();
  const { errors } = formState;
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const dataMutation = { headers: { "X-CSRFToken": csrftoken }, body: data };
    try {
      const res = await updatePassword({ ...dataMutation });
      if (res.data) {
        setValue("new_password", "");
        setValue("current_password", "");
      }
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
    <Box py={1}>
      <form onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Stack spacing={4}>
            {/* Password. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.current_password}>
              <FormLabel children={"Password"} htmlFor="current_password" fontWeight={"bold"} />
              <InputGroup size="sm">
                <CustomTextInput
                  name={"current_password"}
                  placeholder="Current password"
                  register={register}
                  requirements={{ req: true }}
                  type={showPassword ? "text" : "password"}
                  size={"sm"}
                  borderRadius={"md"}
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
              {errors.current_password && (
                <FormErrorMessage children={errors.current_password.message} />
              )}
            </FormControl>
            {/* New password. */}
            <FormControl isDisabled={isLoading} isInvalid={errors.new_password}>
              <FormLabel children={"New password"} htmlFor="new_password" fontWeight={"bold"} />
              <InputGroup size={"sm"}>
                <CustomTextInput
                  name={"new_password"}
                  placeholder="New password"
                  register={register}
                  requirements={{ req: true }}
                  type={showNewPassword ? "text" : "password"}
                  size={"sm"}
                  borderRadius={"md"}
                  pr={"40px"}
                />
                <InputRightElement width="3rem">
                  <ToggleShowPassword
                    isLoading={isLoading}
                    showPassword={showNewPassword}
                    setShowPassword={setShowNewPassword}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.new_password && <FormErrorMessage children={errors.new_password.message} />}
            </FormControl>
          </Stack>
          <Box>
            <CustomButton
              type="submit"
              isLoading={isLoading}
              loadingText="Save password"
              size={"sm"}
              children={"Save password"}
            />
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default PasswordForm;
