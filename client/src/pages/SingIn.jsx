// Hooks.
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../api/authApiSlice";
import { useNavigate } from "react-router-dom";
// Actions.
import { login } from "../features/auth/authSlice";
//Components.

// Page.
function SingIn() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Llama a la mutación con los datos del formulario
      const res = await loginUser(data);

      // result.data contiene los datos de la respuesta del servidor, como el token
      console.log(data);
      console.log(res.data.token);

      dispatch(login({ token: res.data.token }));

      navigate('/user/polls')
      // Aquí puedes realizar redirecciones, actualizaciones de estado, etc., según la respuesta del servidor
    } catch (error) {
      // Manejo de errores si la mutación falla
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

export default SingIn;
