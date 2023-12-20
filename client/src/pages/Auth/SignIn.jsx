import { useForm } from "react-hook-form";
import { useSignInMutation } from "../../api/accountsAPISlice";
import AuthForm from "./AuthForm/AuthForm";
import { Container, Center } from "@chakra-ui/react";

function SignIn() {
  const [signIn, { isLoading }] = useSignInMutation();
  const { register, handleSubmit, formState, setError } = useForm();
  const { errors } = formState;

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn(data);
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
        <AuthForm onSubmit={onSubmit} register={register} errors={errors} isLoading={isLoading} />
      </Center>
    </Container>
  );
}

export default SignIn;
