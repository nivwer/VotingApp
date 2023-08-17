// Hooks.
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../api/authApiSlice";
// Actions.
import { login } from "../features/auth/authSlice";
//Components.

// Page.
function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signIn, { isLoading, isError }] = useSignInMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn(data);

      dispatch(login({ token: res.data.token }));

      navigate("/user/polls");
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      <form onSubmit={onSubmit}>
        {/* Name. */}
        <label htmlFor="username">Username</label>
        <input
          {...register("username", {
            required: {
              value: true,
              message: "Name is required",
            },
            minLength: {
              value: 4,
              message: "Min 4 digits",
            },
          })}
          type="text"
        />
        {/* Handle errors. */}
        {errors.name && <span>{errors.name.message}</span>}

        {/* Password. */}
        <label htmlFor="password">Password</label>
        <input
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
          })}
          type="password"
        />
        {/* Handle errors. */}
        {errors.password && <span>{errors.password.message}</span>}
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default SignIn;
