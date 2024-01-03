import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAddOptionMutation } from "../../../../../api/pollsAPISlice";
import { FormControl, FormErrorMessage, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import CustomTextInput from "../../../../Form/CustomTextInput/CustomTextInput";
import CustomIconButton from "../../../../Buttons/CustomIconButton/CustomIconButton";
import Cookies from "js-cookie";

function PollCardInputOption({ id, setShowInputOption }) {
  const csrftoken = Cookies.get("csrftoken");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.session);
  const [dataMutation, setDataMutation] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm();
  const [addOption, { isLoading }] = useAddOptionMutation();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    if (!isAuthenticated) return navigate("/signin");
    const body = { body: data };
    try {
      const res = await addOption({ ...dataMutation, ...body });
      if (res.data) setShowInputOption(false);
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, { message: res.error.data[fieldName][0] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    const headers = isAuthenticated ? { headers: { "X-CSRFToken": csrftoken } } : {};
    setDataMutation({ ...headers, id: id });
  }, [id, isAuthenticated]);

  return (
    <form onSubmit={onSubmit}>
      <FormControl isDisabled={isLoading} isInvalid={formState.errors.option_text}>
        <InputGroup>
          <CustomTextInput
            name={"option_text"}
            placeholder="Add a option"
            register={register}
            requirements={{ req: true }}
            variant="outline"
            borderRadius={"full"}
            pr={"40px"}
          />
          <InputRightElement>
            <CustomIconButton type="submit" icon={<FaPlus />} size={"sm"} isLoading={isLoading} />
          </InputRightElement>
        </InputGroup>
        {formState.errors.option_text && (
          <FormErrorMessage children={formState.errors.option_text.message} />
        )}
      </FormControl>
    </form>
  );
}

export default PollCardInputOption;
