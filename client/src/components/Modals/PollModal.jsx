// Hooks.
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreatePollMutation } from "../../api/pollApiSlice";
// Components.
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
// Icons.
import { ChevronDownIcon } from "@chakra-ui/icons";

// Component.
function PollModal() {
  const session = useSelector((state) => state.session);
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  // Request to create polls.
  const [createPoll, { isLoading, isError }] = useCreatePollMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Options list.
  const [optionList, setOptionList] = useState([]);
  // Privacy Radio.
  const [privacyValue, setPrivacyValue] = useState("public");
  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const pollData = {
        title: data.title,
        description: data.description,
        privacy: privacyValue,
        category: data.category,
        options: optionList,
      };

      const res = await createPoll({
        poll: pollData,
        token: session.token,
      });

      // If the values is valid.
      if (res.data) {
        onClose();
        reset({ options: "", title: "", description: "" });
        setOptionList([]);
        setPrivacyValue("public");
      }

      // If server error.
      if (res.error) {
        const errorData = res.error.data;

        for (const fieldName in errorData) {
          const errorMessage = errorData[fieldName][0];

          setError(fieldName, {
            message: errorMessage,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Remove the options.
  const handleDeleteOption = (indexToDelete) => {
    const updatedOptions = optionList.filter(
      (_, index) => index !== indexToDelete
    );
    setOptionList(updatedOptions);
  };

  return (
    <>
      {/* Button to open the Modal. */}
      <Button onClick={onOpen}>New Poll</Button>

      {/* Modal. */}
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={isDark ? "black" : `${color}.bg-l-s`}
          color={isDark ? `${color}.text-d-p` : `${color}.900`}
          outline={isDark ? "1px solid" : "2px solid"}
          outlineColor={isDark ? `${color}.border-d` : `${color}.600`}
          borderRadius="14px"
        >
          {isLoading && (
            <Progress
              colorScheme={color}
              borderTopRadius="14px"
              m="auto"
              w={"98%"}
              size="xs"
              isIndeterminate
            />
          )}
          {/* Header. */}
          <ModalHeader>New poll</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <Stack textAlign="start" spacing={3}>
                {/* Title. */}
                <FormControl isDisabled={isLoading} isInvalid={errors.title}>
                  <FormLabel fontWeight={"bold"} htmlFor="title">
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
                        message: "Maximum 113 options allowed.",
                      },
                    })}
                    type="text"
                    placeholder="This is my question."
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                  {/* Handle errors. */}
                  {errors.title && (
                    <FormErrorMessage>{errors.title.message}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Description */}
                <FormControl
                  isDisabled={isLoading}
                  isInvalid={errors.description}
                >
                  <FormLabel fontWeight={"bold"} htmlFor="description">
                    Description
                  </FormLabel>
                  <Textarea
                    {...register("description", {
                      required: false,
                      maxLength: {
                        value: 513,
                        message: "Maximum 513 options allowed.",
                      },
                    })}
                    resize={"none"}
                    placeholder="This is my description."
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                  {/* Handle errors. */}
                  {errors.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Privacy. */}
                <FormControl isDisabled={isLoading} isInvalid={errors.privacy}>
                  <FormLabel fontWeight={"bold"} htmlFor="privacy">
                    Privacy
                  </FormLabel>
                  <RadioGroup
                    onChange={setPrivacyValue}
                    value={privacyValue}
                    defaultValue="public"
                  >
                    <Stack opacity={0.9} direction="row">
                      <Radio colorScheme={color} value="public">
                        Public
                      </Radio>
                      <Radio colorScheme={color} value="private">
                        Private
                      </Radio>
                      <Radio colorScheme={color} value="friends_only">
                        Friends
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {/* Category. */}
                <FormControl isDisabled={isLoading} isInvalid={errors.category}>
                  <FormLabel fontWeight={"bold"} htmlFor="category">
                    Category
                  </FormLabel>
                  <Select
                    {...register("category", {
                      required: {
                        value: true,
                        message: "This field is required.",
                      },
                    })}
                    placeholder="Select a option"
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  >
                    <option value="category1">Category1</option>
                    <option value="category2">Category2</option>
                    <option value="category3">Category3</option>
                  </Select>
                  {/* Handle errors. */}
                  {errors.category && (
                    <FormErrorMessage>
                      {errors.category.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Options */}
                <FormControl isDisabled={isLoading} isInvalid={errors.options}>
                  <FormLabel fontWeight={"bold"} htmlFor="options">
                    Options
                  </FormLabel>
                  <Input
                    {...register("options")}
                    type="text"
                    placeholder="Add a option."
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                  {/* Handle errors. */}
                  {errors.options && (
                    <FormErrorMessage>
                      {errors.options.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <Button
                  isDisabled={isLoading}
                  onClick={() => {
                    const optionValue = watch("options").trim();
                    if (optionValue.length >= 1) {
                      if (optionValue.length >= 113) {
                        setError("options", {
                          message: "Maximum 113 options allowed.",
                        });
                      } else {
                        setOptionList([...optionList, optionValue]);
                        reset({ options: "" }); // Clear the input field
                      }
                    }
                  }}
                  colorScheme={color}
                  variant={"ghost"}
                  bg={isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`}
                  color={isDark ? `${color}.text-d-p` : `${color}.900`}
                  opacity={0.9}
                >
                  Add Option
                </Button>

                <Stack w={"100%"}>
                  {optionList.map((option, index) => (
                    <Flex
                      key={index}
                      bg={
                        isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`
                      }
                      color={isDark ? `${color}.text-d-p` : `${color}.900`}
                      justifyContent="space-between"
                      variant="ghost"
                      borderRadius={5}
                      pr={0}
                      opacity={isDark ? 0.8 : 0.6}
                    >
                      <Text
                        px={4}
                        py={2}
                        wordBreak={"break-all"}
                        fontWeight={"bold"}
                      >
                        {option}
                      </Text>
                      <Button
                        isDisabled={isLoading}
                        type="button"
                        onClick={() => handleDeleteOption(index)}
                      >
                        X
                      </Button>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            </ModalBody>
            {/* Footer. */}
            <ModalFooter>
              <Button
                isDisabled={isLoading}
                type="submit"
                colorScheme={color}
                mr={3}
                opacity={isDark ? 0.9 : 1}
              >
                Save
              </Button>
              <Button
                isDisabled={isLoading}
                onClick={onClose}
                colorScheme={color}
                variant={"ghost"}
                bg={isDark ? `${color}.bg-d-dimmed` : `${color}.bg-l-dimmed`}
                color={isDark ? `${color}.text-d-p` : `${color}.900`}
                opacity={0.9}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PollModal;
