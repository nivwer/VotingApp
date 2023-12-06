import { useForm } from "react-hook-form";
import { useSignUpMutation } from "../../api/authApiSlice";
import AuthForm from "./AuthForm/AuthForm";
import { Center, Container } from "@chakra-ui/react";

function SignUp() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const { register, handleSubmit, watch, formState, setError } = useForm();
  const { errors } = formState;

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signUp(data);
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
    <Container maxW="md">
      <Center minH="calc(100vh - 220px)">
        <AuthForm
          isSignUp={true}
          onSubmit={onSubmit}
          register={register}
          watch={watch}
          errors={errors}
          isLoading={isLoading}
        />
      </Center>
    </Container>
  );
}

export default SignUp;
