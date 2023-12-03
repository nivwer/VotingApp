// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreatePollMutation,
  useGetCategoriesQuery,
  useUpdatePollMutation,
} from "../../../api/pollApiSlice";
// Components.
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  HStack,
} from "@chakra-ui/react";
// SubComponents.
import PollFormBody from "./PollFormBody/PollFormBody";

// Component.
function PollModal({ poll = false, disclosure }) {
  const { isOpen, onClose } = disclosure;
  const navigate = useNavigate();
  const { ThemeColor, isDark } = useThemeInfo();
  const { token, user } = useSelector((state) => state.session);

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  // Request to get poll categories.
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();
  // Request to create polls.
  const [createPoll, { isLoading: isCreateLoading }] = useCreatePollMutation();
  // Request to update polls.
  const [updatePoll, { isLoading: isUpdateLoading }] = useUpdatePollMutation();

  // Is loading.
  const isLoading = isCreateLoading || isUpdateLoading || isCategoriesLoading;

  // Options list.
  const initialOptionsState = { options: [], add_options: [], del_options: [] };
  const [options, setOptions] = useState(initialOptionsState);
  // Privacy Radio.
  const [privacyValue, setPrivacyValue] = useState("public");
  // Poll categories.
  const [categories, setCategories] = useState(false);

  // Default PollModal values.
  const useDefaultValues = () => {
    reset({ options: "", title: "", description: "" });
    setOptions(initialOptionsState);
    setPrivacyValue("public");
  };

  // Load poll options if exist.
  useEffect(() => {
    if (poll) {
      const pollOptions = [];
      for (const option of poll["options"]) {
        pollOptions.push(option["option_text"]);
      }
      setOptions({ ...options, options: pollOptions });
      setPrivacyValue(poll.privacy);
    }
  }, [poll]);

  // Load poll categories.
  useEffect(() => {
    setCategories(categoriesData ? categoriesData.list : false);
  }, [categoriesData]);

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      data["privacy"] = privacyValue;
      data["options"] = options;

      const dataMutation = {
        headers: { Authorization: `Token ${token}` },
        body: data,
      };

      let res = "";

      if (poll) {
        res = await updatePoll({ ...dataMutation, id: poll.id });
        if (res.data) {
          onClose();
          setOptions({ ...options, add_options: [], del_options: [] });
        }
      } else {
        res = await createPoll(dataMutation);
        if (res.data) {
          onClose();
          useDefaultValues();
          navigate(`/${user.username}/${res.data.id}`);
        }
      }

      // If server error.
      if (res.error) {
        for (const fieldName in res.error.data) {
          setError(fieldName, { message: res.error.data[fieldName][0] });
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        m={"auto"}
        bg={isDark ? "black" : "white"}
        border={"1px solid"}
        borderColor={isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300"}
        borderRadius={"3xl"}
      >
        {/* Header. */}
        <ModalHeader>
          <Text fontSize={"xl"} fontWeight={"medium"} opacity={0.9}>
            {poll ? "Edit poll" : "New poll"}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onSubmit}>
          {/* Body. */}
          <ModalBody maxH={"calc(100vh - 300px)"} overflow={"auto"} pb={6}>
            <PollFormBody
              poll={poll && poll}
              form={{ register, watch, reset, setError, errors }}
              optionState={{ options, setOptions }}
              privacyState={{ privacyValue, setPrivacyValue }}
              categories={categories}
              isLoading={isLoading}
            />
          </ModalBody>
          {/* Footer. */}
          <ModalFooter>
            <HStack>
              <Button
                type="submit"
                isDisabled={isLoading}
                colorScheme={ThemeColor}
                borderRadius={"full"}
              >
                {poll ? "Save" : "Create"}
              </Button>
              <Button
                onClick={onClose}
                isDisabled={isLoading}
                opacity={0.8}
                color={isDark ? "white" : "black"}
                borderRadius={"full"}
                colorScheme={"gothicPurpleAlpha"}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default PollModal;
