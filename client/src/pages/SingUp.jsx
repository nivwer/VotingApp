// Hooks.
import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../api/authApiSlice";
// Components.
//import CSRFToken from "../components/Security/CSRFToken"; 

// Page.
function SingUp() {
  //const [createUser] = useCreateUserMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  // Send user data.
  const onSubmit = handleSubmit((data) => {
    //createUser(data);
    console.log(data)
  });

  return (
    <>
      {/* Create user form. */}
      <form onSubmit={onSubmit}>

        {/* Name. */}
        <label htmlFor="name">Name</label>
        <input
          {...register("name", {
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

        {/* Password Validation. */}
        <label htmlFor="passwordValidation">Confirm Password</label>
        <input
          {...register("passwordValidation", {
            required: {
              value: true,
              message: "Password is required",
            },
            validate: (value) =>
              value === watch("password") || "Password not match",
          })}
          type="password"
        />
        {/* Handle errors. */}
        {errors.passwordValidation && (
          <span>{errors.passwordValidation.message}</span>
        )}

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default SingUp;
