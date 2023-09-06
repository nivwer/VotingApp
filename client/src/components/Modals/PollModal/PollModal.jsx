// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreatePollMutation,
  useUpdatePollMutation,
} from "../../../api/pollApiSlice";
// Styles.
import { getPollModalStyles } from "./PollModalStyles";
// Components.
import PollFormBody from "./PollFormBody";
import CustomProgress from "../../Progress/CustomProgress";
import {
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  const initialOptionsState = {
    options: [],
    add_options: [],
    del_options: [],
  };
  const [options, setOptions] = useState(initialOptionsState);
  // Privacy Radio.
  const [privacyValue, setPrivacyValue] = useState("public");

  const useDefaultValues = () => {
    reset({ options: "", title: "", description: "" });
    setOptions(initialOptionsState);
    setPrivacyValue("public");
  };

  useEffect(() => {
    if (poll) {
      const pollOptions = [];
      for (const option of poll["options"]) {
        pollOptions.push(option["option_text"]);
      }
      setOptions({ ...options, options: pollOptions });
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
        options: options,
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
          setOptions({
            ...options,
            add_options: [],
            del_options: [],
          });
        }
      } else {
        res = await createPoll({
          poll: pollData,
          token: session.token,
        });
        // If the values is valid.
        if (res.data) {
          onClose();
          useDefaultValues();
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
          {(isCreating || isUpdating) && <CustomProgress />}
          {/* Header. */}
          <ModalHeader>{poll ? "Edit poll" : "New poll"}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <PollFormBody
                poll={poll}
                register={register}
                watch={watch}
                reset={reset}
                setError={setError}
                errors={errors}
                options={options}
                setOptions={setOptions}
                privacyValue={privacyValue}
                setPrivacyValue={setPrivacyValue}
                styles={styles}
                isDisabled={isCreating || isUpdating}
              />
            </ModalBody>
            {/* Footer. */}
            <ModalFooter>
              <Button
                isDisabled={isCreating || isUpdating}
                type="submit"
                {...styles.footer.submit}
              >
                {poll ? "Save" : "Create"}
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
