// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAddCommentMutation } from "../../../api/pollApiSlice";
// Components.
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

// Component.
function PollCommentInput({ id }) {
  const { isDark } = useThemeInfo();
  const { token } = useSelector((state) => state.session);

  const [addComment, { isLoading }] = useAddCommentMutation();

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  // Add Comment onSubmit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await addComment({
        headers: { Authorization: `Token ${token}` },
        id: id,
        body: data,
      });
      if (res.data) {
        setValue("comment", "");
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
    <form onSubmit={onSubmit}>
      <FormControl isDisabled={isLoading} isInvalid={errors.comment}>
        <FormLabel fontWeight={"bold"} htmlFor="comment">
          Comment
        </FormLabel>
        <Textarea
          {...register("comment", {
            required: "This field is required.",
          })}
          placeholder="Write your comment"
          fontWeight={"medium"}
          borderRadius={"md"}
          focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
        />
        {errors.comment && (
          <FormErrorMessage>{errors.comment.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button type="submit">Comment</Button>
    </form>
  );
}

export default PollCommentInput;
