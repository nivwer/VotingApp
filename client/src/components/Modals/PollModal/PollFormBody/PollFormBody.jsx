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
  InputGroup,
  InputRightElement,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
// Icons.
import { FaPlus, FaTrash } from "react-icons/fa6";

// SubComponent ( PollModal ).
function PollFormBody({ poll, form, optionState, privacyState, categories, isLoading }) {
  const { isDark } = useThemeInfo();
  const { register, watch, reset, setError, errors } = form;
  const { options, setOptions } = optionState;
  const { privacyValue, setPrivacyValue } = privacyState;

  // Add options.
  const handleAddOption = () => {
    const option = watch("options").trim();
    if (option.length < 1) return;
    if (option.length >= 113)
      return setError("options", { message: "Maximum 113 characters allowed." });
    if (options["options"].includes(option))
      return setError("options", { message: "This option already exist." });
    setOptions({
      ...options,
      options: [...options["options"], option],
      ...(options["del_options"].includes(option)
        ? { del_options: options["del_options"].filter((o) => o !== option) }
        : { add_options: [...options["add_options"], option] }),
    });
    reset({ options: "" });
    return;
  };

  // Remove options.
  const handleDeleteOption = (indexToDelete, option) => {
    const InDelOptions = options["del_options"].includes(option);
    setOptions({
      ...options,
      options: options["options"].filter((_, index) => index !== indexToDelete),
      ...(poll && poll.options.some((o) => o.option_text === option && !InDelOptions)
        ? { del_options: [...options["del_options"], option] }
        : { add_options: options["add_options"].filter((o) => o !== option) }),
    });
    return;
  };

  useEffect(() => reset(), [poll]);

  return (
    <Stack spacing={4} color={isDark ? "whiteAlpha.800" : "blackAlpha.800"}>
      {/* Title. */}
      <FormControl isInvalid={errors.title} isDisabled={isLoading}>
        <FormLabel children={"Title"} htmlFor="title" fontWeight={"bold"} />
        <CustomTextInput
          name={"title"}
          placeholder="This is my question."
          defaultValue={poll ? poll.title : ""}
          register={register}
          requirements={{ req: true, maxL: 113 }}
        />
        {errors.title && <FormErrorMessage children={errors.title.message} />}
      </FormControl>

      {/* Description */}
      <FormControl isInvalid={errors.description} isDisabled={isLoading}>
        <FormLabel children={" Description"} htmlFor="description" fontWeight={"bold"} />
        <CustomTextarea
          name={"description"}
          placeholder="This is my description."
          defaultValue={poll ? poll.description : ""}
          register={register}
          requirements={{ maxL: 313 }}
        />
        {errors.description && <FormErrorMessage children={errors.description.message} />}
      </FormControl>

      {/* Category. */}
      <FormControl isInvalid={errors.category} isDisabled={isLoading}>
        <FormLabel children={"Category"} htmlFor="category" fontWeight={"bold"} />
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
        {errors.category && <FormErrorMessage children={errors.category.message} />}
      </FormControl>

      {/* Privacy. */}
      <FormControl isDisabled={isLoading}>
        <FormLabel children={"  Privacy"} htmlFor="privacy" fontWeight={"bold"} />
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
      <FormControl isInvalid={errors.options} isDisabled={isLoading}>
        <FormLabel children={"Options"} htmlFor="options" fontWeight={"bold"}>
          Options
        </FormLabel>
        <Stack w={"100%"}>
          {options["options"].map((option, index) => (
            <Flex
              key={index}
              justifyContent="space-between"
              borderRadius="3xl"
              outline="1px solid"
              outlineColor={isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.500"}
              p="3px"
              opacity={isLoading ? 0.4 : 1}
            >
              <Text
                opacity={0.9}
                fontWeight="medium"
                wordBreak={"break-all"}
                px={"15px"}
                py={"4px"}
                children={option}
              />
              <Box>
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
          <InputGroup>
            <CustomTextInput
              name={"options"}
              placeholder="Add a option."
              register={register}
              variant="outline"
              borderRadius="full"
              pr={"40px"}
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
        {errors.options && <FormErrorMessage children={errors.options.message} />}
      </FormControl>
    </Stack>
  );
}

export default PollFormBody;
