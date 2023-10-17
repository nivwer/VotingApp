// Hooks.
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../api/authApiSlice";
//Components.
import AuthForm from "./components/AuthForm";
import { Container, Center } from "@chakra-ui/react";

// Page.
function SignIn() {
  const navigate = useNavigate();
  const session = useSelector((state) => state.session);

  // Request to the backend.
  const [signIn, { isLoading }] = useSignInMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn(data);
      // If the authentication is valid.
      if (res.data) {
        if (session.user && session.profile) {
          navigate("/home");
        }
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
    <Container maxW="md">
      <Center minH="calc(100vh - 200px)">
        <AuthForm
          onSubmit={onSubmit}
          register={register}
          errors={errors}
          isLoading={isLoading}
        />
      </Center>
    </Container>
  );
}

export default SignIn;
