// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreatePollMutation,
  useUpdatePollMutation,
} from "../../api/pollApiSlice";
// Styles.
import { getPollModalStyles } from "./PollModalStyles";
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
  useDisclosure,
} from "@chakra-ui/react";
// Icons.
import { ChevronDownIcon } from "@chakra-ui/icons";

// Component.
function PollModal({ poll = false, buttonStyles }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getPollModalStyles(ThemeColor, isDark);
  // User session.
  const session = useSelector((state) => state.session);
  // Request to create polls.
  const [createPoll, { isLoading: isCreating }] = useCreatePollMutation();
  // Request to update polls.
  const [updatePoll, { isLoading: isUpdating }] = useUpdatePollMutation();

  // Modal.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  // Options list.
  const [optionList, setOptionList] = useState([]);
  // Privacy Radio.
  const [privacyValue, setPrivacyValue] = useState("public");

  useEffect(() => {
    if (poll) {
      // setOptionList(poll.options);
      setPrivacyValue(poll.privacy);
    }
  }, []);

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

      let res = "";

      if (poll) {
        res = await updatePoll({
          poll_id: poll._id,
          poll: pollData,
          token: session.token,
        });
        // If the values is valid.
        if (res.data) {
          onClose();
        }
      } else {
        res = await createPoll({
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
      }

      // If server error.
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, {
            message: res.error.data[fieldName][0],
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
      <Button onClick={onOpen} {...buttonStyles}>
        {poll ? "Edit poll" : "New poll"}
      </Button>

      {/* Modal. */}
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...styles.content}>
          {(isCreating || isUpdating) && (
            <Progress
              colorScheme={ThemeColor}
              borderTopRadius="14px"
              m="auto"
              w={"98%"}
              size="xs"
              isIndeterminate
            />
          )}
          {/* Header. */}
          <ModalHeader>{poll ? "Edit poll" : "New poll"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <Stack textAlign="start" spacing={3}>
                {/* Title. */}
                <FormControl
                  isDisabled={isCreating || isUpdating}
                  isInvalid={errors.title}
                >
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
                        message: "Maximum 113 options allowed.",
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
                <FormControl
                  isDisabled={isCreating || isUpdating}
                  isInvalid={errors.description}
                >
                  <FormLabel htmlFor="description" fontWeight={"bold"}>
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
                    defaultValue={poll ? poll.description : ""}
                    placeholder="This is my description."
                    focusBorderColor={styles.focusBorderColor}
                    resize={"none"}
                  />
                  {/* Handle errors. */}
                  {errors.description && (
                    <FormErrorMessage>
                      {errors.description.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Privacy. */}
                <FormControl
                  isDisabled={isCreating || isUpdating}
                  isInvalid={errors.privacy}
                >
                  <FormLabel htmlFor="privacy" fontWeight={"bold"}>
                    Privacy
                  </FormLabel>
                  <RadioGroup
                    onChange={setPrivacyValue}
                    value={privacyValue}
                    defaultValue={poll ? poll.privacy : "public"}
                  >
                    <Stack opacity={0.9} direction="row">
                      <Radio colorScheme={ThemeColor} value="public">
                        Public
                      </Radio>
                      <Radio colorScheme={ThemeColor} value="private">
                        Private
                      </Radio>
                      <Radio colorScheme={ThemeColor} value="friends_only">
                        Friends
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                {/* Category. */}
                <FormControl
                  isDisabled={isCreating || isUpdating}
                  isInvalid={errors.category}
                >
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
                    <FormErrorMessage>
                      {errors.category.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Options. */}
                <FormControl
                  isDisabled={isCreating || isUpdating}
                  isInvalid={errors.options}
                >
                  <FormLabel htmlFor="options" fontWeight={"bold"}>
                    Options
                  </FormLabel>
                  <Input
                    {...register("options")}
                    type="text"
                    placeholder="Add a option."
                    focusBorderColor={styles.focusBorderColor}
                  />
                  {/* Handle errors. */}
                  {errors.options && (
                    <FormErrorMessage>
                      {errors.options.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {/* Add options. */}
                <Button
                  isDisabled={isCreating || isUpdating}
                  {...styles.body.options.add_button}
                  onClick={() => {
                    const optionValue = watch("options").trim();
                    if (optionValue.length >= 1) {
                      if (optionValue.length >= 113) {
                        setError("options", {
                          message: "Maximum 113 options allowed.",
                        });
                      } else {
                        setOptionList([...optionList, optionValue]);
                        reset({ options: "" }); // Clear the input field.
                      }
                    }
                  }}
                >
                  Add Option
                </Button>

                {/* Options list. */}
                <Stack w={"100%"}>
                  {optionList.map((option, index) => (
                    <Flex key={index} {...styles.body.options.list}>
                      <Text {...styles.body.options.item}>{option}</Text>
                      <Button
                        isDisabled={isCreating || isUpdating}
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
                isDisabled={isCreating || isUpdating}
                type="submit"
                {...styles.footer.submit}
              >
                Save
              </Button>
              <Button
                isDisabled={isCreating || isUpdating}
                onClick={onClose}
                {...styles.footer.cancel}
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
