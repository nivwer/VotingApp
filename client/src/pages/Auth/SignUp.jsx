import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../api/authApiSlice";
import AuthForm from "./AuthForm/AuthForm";
import { Center, Container } from "@chakra-ui/react";

function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.session);
  const [signUp, { isLoading }] = useSignUpMutation();
  const { register, handleSubmit, watch, formState, setError } = useForm();
  const { errors } = formState;

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signUp(data);
      if (res.data && isAuthenticated) navigate("/home");
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
      <Center minH="calc(100vh - 200px)">
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
