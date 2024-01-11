import { useThemeInfo } from "../../../hooks/Theme";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCreatePollMutation, useUpdatePollMutation, useGetCategoriesQuery } from "../../../api/pollsAPISlice";
import CustomButton from "../../Buttons/CustomButton/CustomButton";
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
import PollFormBody from "./PollFormBody/PollFormBody";
import Cookies from "js-cookie";

function PollModal({ poll = false, disclosure }) {
  const csrftoken = Cookies.get("csrftoken");
  const { isOpen, onClose } = disclosure;
  const navigate = useNavigate();
  const { ThemeColor, isDark } = useThemeInfo();
  const { user } = useSelector((state) => state.session);
  const { register, handleSubmit, watch, reset, formState, setError } = useForm();
  const [createPoll, { isLoading: isCreateLoading }] = useCreatePollMutation();
  const [updatePoll, { isLoading: isUpdateLoading }] = useUpdatePollMutation();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const isLoading = isCreateLoading || isUpdateLoading || isCategoriesLoading;
  const initialOptionsState = { options: [], add_options: [], del_options: [] };
  const [options, setOptions] = useState(initialOptionsState);
  const [privacyValue, setPrivacyValue] = useState("public");
  const [categories, setCategories] = useState(false);

  const useDefaultValues = () => {
    reset({ options: "", title: "", description: "" });
    setOptions(initialOptionsState);
    setPrivacyValue("public");
  };

  useEffect(() => {
    if (poll) {
      setOptions({ ...options, options: poll.options.map((option) => option.option_text) });
      setPrivacyValue(poll.privacy);
    }
  }, [poll]);

  useEffect(() => setCategories(categoriesData ? categoriesData.list : false), [categoriesData]);

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    data["privacy"] = privacyValue;
    data["options"] = options;
    const dataMutation = { headers: { "X-CSRFToken": csrftoken }, body: data };
    try {
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
    <Modal size={{ base: "full", sm: "lg" }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        m={"auto"}
        bg={isDark ? "black" : "white"}
        border={"1px solid"}
        borderColor={isDark ? "gothicPurpleAlpha.300" : "gothicPurpleAlpha.300"}
        borderRadius={"3xl"}
        mx={{ base: 0, sm: 4 }}
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
          <ModalBody maxH={{ base: "100% ", sm: "calc(100vh - 300px)" }} overflow={"auto"} pb={6}>
            <PollFormBody
              poll={poll && poll}
              form={{ register, watch, reset, setError, errors: formState.errors }}
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
                children={poll ? "Save" : "Create"}
              />
              <CustomButton children={"Cancel"} onClick={onClose} isDisabled={isLoading} />
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default PollModal;
