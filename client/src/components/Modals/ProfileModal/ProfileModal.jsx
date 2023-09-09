// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
// Styles
import { getProfileModalStyles } from "./ProfileModalStyles";
// Components.
import ProfileFormBody from "./ProfileFormBody";
import CustomProgress from "../../Progress/CustomProgress";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBedPulse } from "react-icons/fa6";
import { useUpdateProfileMutation } from "../../../api/profileApiSlice";

// Component.
function ProfileModal({ profile = false, buttonStyles }) {
  const { ThemeColor, isDark } = useThemeInfo();
  const styles = getProfileModalStyles(ThemeColor, isDark);
  // Modal.
  const { isOpen, onOpen, onClose } = useDisclosure();

  // User session.
  const session = useSelector((state) => state.session);

  // React hook form.
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  // Request to update profile.
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  // Submit.
  const onSubmit = handleSubmit(async (data) => {
    try {
      const profileData = {
        profile_name: data.profile_name,
      };

      const res = await updateProfile({
        profile: profileData,
        token: session.token,
      });

      if (res.data) {
        onClose();
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
        Edit profile
      </Button>

      {/* Modal. */}
      <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...styles.content}>
          {isLoading && <CustomProgress />}
          {/* Header. */}
          <ModalHeader>Edit profile</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={onSubmit}>
            {/* Body. */}
            <ModalBody pb={6}>
              <ProfileFormBody
                profile={profile}
                register={register}
                errors={errors}
                styles={styles}
                isLoading={isLoading}
              />
            </ModalBody>

            {/* Footer. */}
            <ModalFooter>
              <Button
                isDisabled={isLoading}
                type="submit"
                {...styles.footer.submit}
              >
                Save
              </Button>
              <Button
                isDisabled={isLoading}
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

export default ProfileModal;