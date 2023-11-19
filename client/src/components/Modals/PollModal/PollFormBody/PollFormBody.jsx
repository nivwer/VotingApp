// Hooks.
import { useThemeInfo } from "../../../../hooks/Theme";
// Components.
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
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
  const { register, watch, reset, setError, errors } = form;
  const { options, setOptions } = optionState;
  const { privacyValue, setPrivacyValue } = privacyState;

  // Add the options.
  const handleAddOption = () => {
    const option = watch("options").trim();
    const InOptions = options["options"].includes(option);
    const InDelOptions = options["del_options"].includes(option);
    if (option.length >= 1) {
      if (option.length >= 113) {
        setError("options", {
          message: "Maximum 113 characters allowed.",
        });
      } else if (InOptions) {
        setError("options", {
          message: "This option already exist.",
        });
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
    <Stack textAlign="start" spacing={3}>
      {/* Title. */}
      <FormControl isDisabled={isLoading} isInvalid={errors.title}>
        <FormLabel htmlFor="title" fontWeight={"bold"}>
          Title
        </FormLabel>
        <Input
          {...register("title", {
            required: "This field is required.",
            maxLength: {
              value: 113,
              message: "Maximum 113 characters allowed.",
            },
          })}
          variant={"outline"}
          type="text"
          fontWeight={"medium"}
          opacity={"0.9"}
          defaultValue={poll ? poll.title : ""}
          placeholder="This is my question."
          focusBorderColor={focusBorderColor}
        />
        {/* Handle errors. */}
        {errors.title && (
          <FormErrorMessage>{errors.title.message}</FormErrorMessage>
        )}
      </FormControl>

      {/* Description */}
      <FormControl isDisabled={isLoading} isInvalid={errors.description}>
        <FormLabel htmlFor="description" fontWeight={"bold"}>
          Description
        </FormLabel>
        <Textarea
          {...register("description", {
            required: false,
            maxLength: {
              value: 313,
              message: "Maximum 313 characters allowed.",
            },
          })}
          fontWeight={"medium"}
          opacity={"0.9"}
          defaultValue={poll ? poll.description : ""}
          placeholder="This is my description."
          focusBorderColor={focusBorderColor}
          resize={"none"}
        />
        {/* Handle errors. */}
        {errors.description && (
          <FormErrorMessage>{errors.description.message}</FormErrorMessage>
        )}
      </FormControl>

      {/* Category. */}
      <FormControl isDisabled={isLoading} isInvalid={errors.category}>
        <FormLabel htmlFor="category" fontWeight={"bold"}>
          Category
        </FormLabel>
        <Select
          {...register("category", {
            required: "This field is required.",
          })}
          opacity={isDark ? 0.9 : 0.7}
          fontWeight={"semibold"}
          variant={"filled"}
          borderRadius={"xl"}
          defaultValue={poll ? poll.category : ""}
          placeholder="Category..."
          focusBorderColor={focusBorderColor}
        >
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category.value}>
                {category.text}
              </option>
            ))}
        </Select>
        {/* Handle errors. */}
        {errors.category && (
          <FormErrorMessage>{errors.category.message}</FormErrorMessage>
        )}
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
          <Stack opacity={0.8} direction="row" fontWeight={"semibold"}>
            <Radio value="public" colorScheme={ThemeColor}>
              Public
            </Radio>
            <Radio value="private" colorScheme={ThemeColor}>
              Private
            </Radio>
          </Stack>
        </RadioGroup>
      </FormControl>

      {/* Options. */}
      <FormControl isDisabled={isLoading} isInvalid={errors.options}>
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
              >
                {option}
              </Text>
              <Box>
                <IconButton
                  isDisabled={isLoading}
                  borderRadius={"full"}
                  size={"sm"}
                  variant={"ghost"}
                  opacity={0.6}
                  onClick={() => handleDeleteOption(index, option)}
                >
                  <FaTrash />
                </IconButton>
              </Box>
            </Flex>
          ))}
          <InputGroup>
            <Input
              {...register("options")}
              type="text"
              placeholder="Add a option."
              {...optionStyles}
              px={"19px"}
              focusBorderColor={focusBorderColor}
            />
            <InputRightElement>
              {/* Add options. */}
              <IconButton
                isDisabled={isLoading}
                borderRadius={"full"}
                size={"sm"}
                opacity={0.9}
                onClick={() => handleAddOption()}
              >
                <FaPlus />
              </IconButton>
            </InputRightElement>
          </InputGroup>
        </Stack>
        {/* Handle errors. */}
        {errors.options && (
          <FormErrorMessage>{errors.options.message}</FormErrorMessage>
        )}
      </FormControl>
    </Stack>
  );
}

export default PollFormBody;
