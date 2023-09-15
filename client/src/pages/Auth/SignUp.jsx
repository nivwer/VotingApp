// Hooks.
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../api/authApiSlice";
// Actions.
import { login } from "../../features/auth/sessionSlice";
// Components.
import AuthForm from "./AuthForm";
import { Center, Container } from "@chakra-ui/react";

// Page.
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Request to the backend.
  const [signUp, { isLoading }] = useSignUpMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signUp(data);
      // If the registration is valid.
      if (res.data) {
        dispatch(login(res.data));
        navigate("/home");
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
    <Container maxW="xl">
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
