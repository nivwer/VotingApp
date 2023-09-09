// Hooks.
import { useEffect } from "react";
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
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
  const { ThemeColor, isDark } = useThemeInfo();

  // Remove the options.
  const handleDeleteOption = (indexToDelete, option) => {
    const InDelOptions = options["del_options"].includes(option);
    let delOption = false;
    for (const o of poll["options"]) {
      if (o["option_text"] === option && !InDelOptions) {
        delOption = true;
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
    <>
      <Stack textAlign="start" spacing={3}>
        {/* Title. */}
        <FormControl isDisabled={isLoading} isInvalid={errors.title}>
          <FormLabel htmlFor="title" fontWeight={"bold"}>
            Title
          </FormLabel>
          <Input
            {...register("title", {
              required: {
                value: true,
                message: "This field is required.",
              },
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
                value: 513,
                message: "Maximum 513 characters allowed.",
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
              required: {
                value: true,
                message: "This field is required.",
              },
            })}
            defaultValue={poll ? poll.category : ""}
            placeholder="Select a option"
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
              <Flex key={index} {...styles.body.options.list}>
                <Text {...styles.body.options.item}>{option}</Text>
                <Button
                  isDisabled={isLoading}
                  type="button"
                  onClick={() => handleDeleteOption(index, option)}
                >
                  X
                </Button>
              </Flex>
            ))}
            <Input
              {...register("options")}
              type="text"
              placeholder="Add a option."
              focusBorderColor={styles.focusBorderColor}
            />
          </Stack>
          {/* Handle errors. */}
          {errors.options && (
            <FormErrorMessage>{errors.options.message}</FormErrorMessage>
          )}
        </FormControl>
        {/* Add options. */}
        <Button
          isDisabled={isLoading}
          {...styles.body.options.add_button}
          onClick={() => {
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
              } else {
                if (InDelOptions) {
                  const updatedDelOptions = options["del_options"].filter(
                    (o) => o !== option
                  );
                  setOptions({
                    ...options,
                    options: [...options["options"], option],
                    del_options: updatedDelOptions,
                  });
                } else {
                  setOptions({
                    ...options,
                    options: [...options["options"], option],
                    add_options: [...options["add_options"], option],
                  });
                }

                reset({ options: "" });
              }
            }
          }}
        >
          Add Option
        </Button>
      </Stack>
    </>
  );
}

export default PollFormBody;
