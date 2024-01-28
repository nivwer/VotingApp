import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useUpdateUsernameMutation } from "../../../../../api/accountsAPISlice";
import { Box, FormControl, FormErrorMessage, FormLabel, Stack } from "@chakra-ui/react";
import CustomTextInput from "../../../../../components/Form/CustomTextInput/CustomTextInput";
import CustomButton from "../../../../../components/Buttons/CustomButton/CustomButton";

function UsernameForm() {
  const { user, csrftoken } = useSelector((state) => state.session);
  const [updateUsername, { isLoading }] = useUpdateUsernameMutation();
  const { register, handleSubmit, formState, setError } = useForm();
  const { errors } = formState;

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    const dataMutation = { headers: { "X-CSRFToken": csrftoken }, body: data };
    try {
      const res = await updateUsername({ ...dataMutation });
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
          <FormControl isInvalid={errors.new_username} isDisabled={isLoading}>
            <FormLabel children={"Username"} htmlFor="new_username" fontWeight={"bold"} />
            <CustomTextInput
              name={"new_username"}
              defaultValue={user.username}
              placeholder="Change username"
              register={register}
              requirements={{ req: true }}
              size={"sm"}
              borderRadius={"md"}
            />
            {errors.new_username && <FormErrorMessage children={errors.new_username.message} />}
          </FormControl>
          <Box>
            <CustomButton
              type="submit"
              isLoading={isLoading}
              loadingText="Save username"
              size={"sm"}
              children={"Save username"}
            />
          </Box>
        </Stack>
      </form>
    </Box>
  );
}

export default UsernameForm;
