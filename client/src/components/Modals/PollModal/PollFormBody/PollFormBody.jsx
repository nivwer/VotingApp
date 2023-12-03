// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
import { useEffect } from "react";
// Components.
import CustomRadio from "../../../../components/Form/CustomRadio/CustomRadio";
import CustomIconButton from "../../../Buttons/CustomIconButton/CustomIconButton";
import CustomTextInput from "../../../Form/CustomTextInput/CustomTextInput";
import CustomTextarea from "../../../Form/CustomTextarea/CustomTextarea";
import CustomSelect from "../../../Form/CustomSelect/CustomSelect";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaPlus, FaTrash } from "react-icons/fa6";

// SubComponent ( PollModal ).
function PollFormBody({
  poll,
  form,
  optionState,
  privacyState,
  categories,
  isLoading,
}) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { register, watch, reset, setError, errors: e } = form;
  const { options, setOptions } = optionState;
  const { privacyValue, setPrivacyValue } = privacyState;

  // Add the options.
  const handleAddOption = () => {
    console.log("click");
    const option = watch("options").trim();
    const InOptions = options["options"].includes(option);
    const InDelOptions = options["del_options"].includes(option);
    if (option.length >= 1) {
      if (option.length >= 113) {
        setError("options", { message: "Maximum 113 characters allowed." });
      } else if (InOptions) {
        setError("options", { message: "This option already exist." });
      } else if (InDelOptions) {
        const updatedDelOptions = options["del_options"].filter(
          (o) => o !== option
        );
        setOptions({
          ...options,
          options: [...options["options"], option],
          del_options: updatedDelOptions,
        });
        reset({ options: "" });
      } else {
        setOptions({
          ...options,
          options: [...options["options"], option],
          add_options: [...options["add_options"], option],
        });
        reset({ options: "" });
      }
    }
  };

  // Remove the options.
  const handleDeleteOption = (indexToDelete, option) => {
    const InDelOptions = options["del_options"].includes(option);
    let delOption = false;
    if (poll) {
      for (const o of poll["options"]) {
        if (o["option_text"] === option && !InDelOptions) {
          delOption = true;
        }
      }
    }
    const updatedOptions = options["options"].filter(
      (_, index) => index !== indexToDelete
    );

    if (delOption) {
      setOptions({
        ...options,
        options: updatedOptions,
        del_options: [...options["del_options"], option],
      });
    } else {
      const updatedAddOptions = options["add_options"].filter(
        (o) => o !== option
      );
      setOptions({
        ...options,
        options: updatedOptions,
        add_options: updatedAddOptions,
      });
    }
  };

  useEffect(() => {
    poll && reset();
  }, [poll]);

  const optionStyles = {
    justifyContent: "space-between",
    fontWeight: "semibold",
    borderRadius: "3xl",
    border: "1px solid",
    borderColor: isDark ? "whiteAlpha.300" : "blackAlpha.400",
    opacity: 0.8,
    p: "3px",
  };

  const focusBorderColor = isDark ? "whiteAlpha.600" : "blackAlpha.700";

  return (
    <Stack spacing={4} color={isDark ? "whiteAlpha.800" : "blackAlpha.800"}>
      {/* Title. */}
      <FormControl isInvalid={e.title} isDisabled={isLoading}>
        <FormLabel children={"Title"} htmlFor="title" fontWeight={"bold"} />
        <CustomTextInput
          name={"title"}
          placeholder="This is my question."
          defaultValue={poll ? poll.title : ""}
          register={register}
          requirements={{ req: true, maxL: 113 }}
        />
        {e.title && <FormErrorMessage children={e.title.message} />}
      </FormControl>

      {/* Description */}
      <FormControl isInvalid={e.description} isDisabled={isLoading}>
        <FormLabel htmlFor="description" fontWeight={"bold"}>
          Description
        </FormLabel>
        <CustomTextarea
          name={"description"}
          placeholder="This is my description."
          defaultValue={poll ? poll.description : ""}
          register={register}
          requirements={{ maxL: 313 }}
        />
        {/* Handle errors. */}
        {e.description && <FormErrorMessage children={e.description.message} />}
      </FormControl>

      {/* Category. */}
      <FormControl isInvalid={e.category} isDisabled={isLoading}>
        <FormLabel htmlFor="category" fontWeight={"bold"}>
          Category
        </FormLabel>
        <CustomSelect
          name={"category"}
          register={register}
          requirements={{ req: true }}
          defaultValue={poll ? poll.category : ""}
          placeholder={"Category..."}
        >
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category.value}>
                {category.text}
              </option>
            ))}
        </CustomSelect>
        {/* Handle errors. */}
        {e.category && <FormErrorMessage children={e.category.message} />}
      </FormControl>

      {/* Privacy. */}
      <FormControl isDisabled={isLoading}>
        <FormLabel htmlFor="privacy" fontWeight={"bold"}>
          Privacy
        </FormLabel>
        <RadioGroup
          onChange={setPrivacyValue}
          value={privacyValue}
          defaultValue={poll ? poll.privacy : "public"}
        >
          <Stack direction="row" spacing={"3"} fontWeight={"medium"}>
            <CustomRadio value="public" children={"Public"} />
            <CustomRadio value="private" children={"Private"} />
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Options. */}
      <FormControl isInvalid={e.options} isDisabled={isLoading}>
        <FormLabel htmlFor="options" fontWeight={"bold"}>
          Options
        </FormLabel>
        {/* Options list. */}
        <Stack w={"100%"}>
          {options["options"].map((option, index) => (
            <Flex key={index} {...optionStyles} opacity={isLoading ? 0.4 : 1}>
              <Text
                opacity={0.7}
                wordBreak={"break-all"}
                px={"15px"}
                py={"4px"}
                children={option}
              />
              <Box>
                {/* <IconButton
                  isDisabled={isLoading}
                  borderRadius={"full"}
                  size={"sm"}
                  variant={"ghost"}
                  opacity={0.6}
                  onClick={() => handleDeleteOption(index, option)}
                  icon={<FaTrash />}
                /> */}

                <CustomIconButton
                  onClick={() => handleDeleteOption(index, option)}
                  icon={<FaTrash />}
                  isDisabled={isLoading}
                  variant={"ghost"}
                  size={"sm"}
                />
              </Box>
            </Flex>
          ))}
          {/* Option text input. */}
          <InputGroup>
            <CustomTextInput
              name={"options"}
              placeholder="Add a option."
              register={register}
              variant="outline"
              borderRadius="full"
            />
            <InputRightElement>
              <CustomIconButton
                onClick={() => handleAddOption()}
                icon={<FaPlus />}
                isDisabled={isLoading}
                size={"sm"}
              />
            </InputRightElement>
          </InputGroup>
        </Stack>
        {/* Handle errors. */}
        {e.options && <FormErrorMessage children={e.options.message} />}
      </FormControl>
    </Stack>
  );
}

export default PollFormBody;
