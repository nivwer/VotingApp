// Hooks.
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useAddOptionMutation } from "../../../../../api/pollApiSlice";
// Components.
import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
// Icons.
import { FaPlus } from "react-icons/fa6";

// SubComponent( PollCardBody ).
function PollCardInputOption({ id, setShowInputOption }) {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state) => state.session);
  const { isDark } = useThemeInfo();
  const [dataMutation, setDataMutation] = useState(false);

  // React hook form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Request to the backend.
  const [addOption, { isLoading }] = useAddOptionMutation();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    if (isAuthenticated) {
      const body = { body: data };
      try {
        const res = await addOption({ ...dataMutation, ...body });
        res.data && setShowInputOption(false);

        // If server error.
        if (res.error) {
          for (const fieldName in res.error.data) {
            setError(fieldName, { message: res.error.data[fieldName][0] });
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      navigate("/signin");
    }
  });

  // Update data to mutations.
  useEffect(() => {
    const headers = isAuthenticated
      ? { headers: { Authorization: `Token ${token}` } }
      : {};

    setDataMutation({ ...headers, id: id });
  }, [isAuthenticated]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl isDisabled={isLoading} isInvalid={errors.option_text}>
        <InputGroup>
          <Input
            {...register("option_text", {
              required: "This field is required.",
            })}
            type="text"
            placeholder="Add a option"
            focusBorderColor={isDark ? "whiteAlpha.600" : "blackAlpha.700"}
            borderRadius={"full"}
            borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.400"}
            opacity={0.8}
            justifyContent="start"
            wordBreak={"break-all"}
            pl={"5"}
          />
          <InputRightElement>
            <IconButton
              type="submit"
              borderRadius={"full"}
              size={"sm"}
              isLoading={isLoading}
            >
              <FaPlus />
            </IconButton>
          </InputRightElement>
        </InputGroup>
        {/* Handle errors. */}
        {errors.option_text && (
          <FormErrorMessage>{errors.option_text.message}</FormErrorMessage>
        )}
      </FormControl>
    </form>
  );
}

export default PollCardInputOption;
