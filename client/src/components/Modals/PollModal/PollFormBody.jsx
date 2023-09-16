// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
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

// Component.
function PollFormBody({
  poll,
  register,
  watch,
  reset,
  setError,
  errors,
  options,
  setOptions,
  privacyValue,
  setPrivacyValue,
  styles,
  isLoading,
}) {
  const { ThemeColor } = useThemeInfo();

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
          type="text"
          defaultValue={poll ? poll.title : ""}
          placeholder="This is my question."
          focusBorderColor={styles.focusBorderColor}
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
          defaultValue={poll ? poll.description : ""}
          placeholder="This is my description."
          focusBorderColor={styles.focusBorderColor}
          resize={"none"}
        />
        {/* Handle errors. */}
        {errors.description && (
          <FormErrorMessage>{errors.description.message}</FormErrorMessage>
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
          <Stack opacity={0.9} direction="row">
            <Radio value="public" colorScheme={ThemeColor}>
              Public
            </Radio>
            <Radio value="private" colorScheme={ThemeColor}>
              Private
            </Radio>
            <Radio value="friends_only" colorScheme={ThemeColor}>
              Friends
            </Radio>
          </Stack>
        </RadioGroup>
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
          defaultValue={poll ? poll.category : ""}
          placeholder="Category..."
          focusBorderColor={styles.focusBorderColor}
        >
          <option value="category1">Category1</option>
          <option value="category2">Category2</option>
          <option value="category3">Category3</option>
        </Select>
        {/* Handle errors. */}
        {errors.category && (
          <FormErrorMessage>{errors.category.message}</FormErrorMessage>
        )}
      </FormControl>

      {/* Options. */}
      <FormControl isDisabled={isLoading} isInvalid={errors.options}>
        <FormLabel htmlFor="options" fontWeight={"bold"}>
          Options
        </FormLabel>
        {/* Options list. */}
        <Stack w={"100%"}>
          {options["options"].map((option, index) => (
            <Flex
              key={index}
              {...styles.body.options.item}
              opacity={isLoading ? 0.4 : 1}
            >
              <Text wordBreak={"break-all"} px={"15px"} py={"4px"}>
                {option}
              </Text>
              <Box>
                <IconButton
                  isDisabled={isLoading}
                  borderRadius={"full"}
                  size={"sm"}
                  onClick={() => handleDeleteOption(index, option)}
                ></IconButton>
              </Box>
            </Flex>
          ))}
          <InputGroup>
            <Input
              {...register("options")}
              type="text"
              placeholder="Add a option."
              {...styles.body.options.item}
              px={"19px"}
              focusBorderColor={styles.focusBorderColor}
            />
            <InputRightElement>
              {/* Add options. */}
              <IconButton
                isDisabled={isLoading}
                borderRadius={"full"}
                size={"sm"}
                onClick={() => handleAddOption()}
              ></IconButton>
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
