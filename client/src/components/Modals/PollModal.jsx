// Hooks.
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreatePollMutation } from "../../api/pollApiSlice";
// Components.
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
// Icons.
import { ChevronDownIcon } from "@chakra-ui/icons";

// Component.
function PollModal() {
  const navigate = useNavigate();
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
  const [privacyValue, setPrivacyValue] = useState("public");
  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
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

      await createPoll({
        poll: pollData,
        token: session.token,
      });
      navigate("/home");
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
          {/* Header. */}
          <ModalHeader>New poll</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <Stack textAlign="start" spacing={3}>
                {/* Title. */}
                <FormControl>
                  <FormLabel fontWeight={"bold"} htmlFor="title">
                    Title
                  </FormLabel>
                  <Input
                    {...register("title", {
                      required: {
                        value: true,
                        message: "Title is required.",
                      },
                      maxLength: {
                        value: 113,
                        message: "Max 113 digits",
                      },
                    })}
                    type="text"
                    placeholder="This is my question."
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                  {/* Handle errors. */}
                  {errors.title && <span>{errors.title.message}</span>}
                </FormControl>

                {/* Description */}
                <FormControl>
                  <FormLabel fontWeight={"bold"} htmlFor="description">
                    Description
                  </FormLabel>
                  <Textarea
                    {...register("description", {
                      required: false,
                      maxLength: {
                        value: 513,
                        message: "Max 513 digits",
                      },
                    })}
                    placeholder="This is my description."
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                  {/* Handle errors. */}
                  {errors.description && (
                    <span>{errors.description.message}</span>
                  )}
                </FormControl>

                {/* Privacy. */}
                <FormControl>
                  <FormLabel fontWeight={"bold"} htmlFor="privacy">
                    Privacy
                  </FormLabel>
                  <RadioGroup
                    onChange={setPrivacyValue}
                    value={privacyValue}
                    defaultValue="public"
                  >
                    <Stack direction="row">
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
                {/* Handle errors. */}
                {errors.privacy && <span>{errors.privacy.message}</span>}

                {/* Category. */}
                <FormControl>
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
                  {errors.category && <span>{errors.category.message}</span>}
                </FormControl>

                {/* Options */}
                <FormControl>
                  <FormLabel fontWeight={"bold"} htmlFor="options">
                    Options
                  </FormLabel>
                  <Input
                    {...register("options")}
                    type="text"
                    focusBorderColor={
                      isDark ? `${color}.border-d` : `${color}.600`
                    }
                  />
                </FormControl>
                <Button
                  onClick={() => {
                    const optionValue = watch("options").trim();
                    if (optionValue.length >= 1) {
                      setOptionList([...optionList, optionValue]);
                      reset({ options: "" }); // Clear the input field
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
                {/* Handle errors. */}
                {errors.options && <span>{errors.options.message}</span>}

                <ul>
                  {optionList.map((option, index) => (
                    <li key={index}>
                      {option}
                      <button
                        type="button"
                        onClick={() => handleDeleteOption(index)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </Stack>
            </ModalBody>
            {/* Footer. */}
            <ModalFooter>
              <Button
                type="submit"
                colorScheme={color}
                mr={3}
                opacity={isDark ? 0.9 : 1}
              >
                Save
              </Button>
              <Button
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
